import { get, writable } from 'svelte/store';
import {
  getPortalItems,
  getContacts,
  getJoinedGroups,
  getInstalledApps,
  getFeed,
  getPals,
  subscribeToGroup,
} from '@root/api';

export const state = writable({});
export const feed = writable({});

export const refreshPortalItems = () => {
  getPortalItems().then(({ items }) => {
    state.update((s) => {
      items.forEach((i) => {
        s[i.keyStr] = i;
      });
      s.isLoaded = true;
      return s;
    });
  });
};

export const refreshContacts = () => {
  getContacts().then((contacts) => {
    state.update((s) => {
      s.profiles = contacts;
      // also mush this into the state because it's easier when dealing with
      // multiple struc types at other places in the app
      Object.entries(contacts).forEach(([key, data]) => {
        const keyStr = `/ship/${key}//`;
        s[keyStr] = {
          ...s[keyStr],
          bespoke: { ...data },
          keyObj: keyStrToObj(keyStr),
        };
      });
      return s;
    });
  });
};

export const refreshGroups = () => {
  getJoinedGroups().then((groups) => {
    // for some reasons it's possible to get groups that don't have a title
    // so we filter them here to avoid showing useless info
    let _groups = {};
    state.update((s) => {
      Object.entries(groups || {})
        .map((g) => {
          let [
            key,
            {
              meta: { title },
            },
          ] = g;
          if (!title) {
            g[1].joining = true;
          }
          return g;
        })
        .forEach(([key, data]) => {
          // we should subscribe to the group here
          if (!s[`/group/${key}/`]) subscribeToGroup(key);
          _groups[key] = data;
        });
      s.groups = _groups;
      return s;
    });
  });
};

export const refreshApps = () => {
  const EXCLUDE_APPS = [
    'base',
    'garden',
    'groups',
    'kids',
    'landscape',
    'webterm',
  ];
  getInstalledApps().then(([{ initial }, kiln]) => {
    // so here we have an
    console.log({ initial, kiln });
    let apps = {};
    state.update((s) => {
      Object.entries(initial).forEach(([key, data]) => {
        if (EXCLUDE_APPS.includes(key)) return;
        data.ship = kiln[key]?.sync?.ship;
        if (!data.ship) return;
        apps[key] = data;
      });
      s.apps = apps;
      return s;
    });
  });
};

export const refreshPals = () => {
  getPals().then((pals) => {
    state.update((s) => {
      s.pals = pals.outgoing;
      return s;
    });
  });
};

export const getCurator = (patp) => {
  return { ...mainCollection(patp), ...get(state)?.[`/ship/${patp}//`] };
};

export const getCuratorFeed = (patp) => {
  return getCollectionItems(feedKey(patp));
};

export const getCuratorCollections = (patp) => {
  return (getCuratorItemsByStruc(patp, 'collection') || [])
    .filter((k) => k.keyObj.time !== '~2000.1.1')
    .filter((k) => k.keyObj.time !== 'index');
};

export const getCuratorItemsByStruc = (patp, struc) => {
  return Object.keys(get(state))
    .filter((k) => k.includes(`${struc}/${patp}`))
    .map((k) => get(state)[k]);
};

export const getGroup = (groupKey) => {
  return get(state)[`/group/${groupKey}/`];
};

export const getItem = (listKey) => {
  return get(state)[listKey];
};

export const getProfile = (ship) => {
  return get(state).profiles?.[ship];
};

export const getCollectionItems = (collectionKey) => {
  return get(state)
    [collectionKey]?.bespoke?.['key-list']?.map((k) => {
      return get(state)[keyStrFromObj(k)];
    })
    .filter((i) => !!i);
};

export const getJoinedGroupDetails = (groupKey) => {
  return get(state).groups?.[groupKey];
};

export const handleSubscriptionEvent = (event, type) => {
  console.log({ event, type });
  switch (type) {
    case 'portal-update':
      state.update((s) => {
        s[event.keyStr] = event;
        return s;
      });
    case 'contact-news':
      refreshContacts();
    case 'charge-update':
      refreshApps();
    case 'group-action-0' || 'group-leave':
      refreshGroups();
    default:
      break;
  }
};

export const keyStrFromObj = ({ struc, ship, cord, time }) => {
  return `/${struc}/${ship}/${cord}/${time}`;
};

export const keyStrToObj = (str) => {
  const parts = str.split('/');
  return {
    struc: parts[1],
    ship: parts[2],
    cord: parts[3],
    time: parts[4],
  };
};

const mainCollection = (patp) => get(state)[mainCollectionKey(patp)];
const mainCollectionKey = (patp) => `/collection/${patp}//~2000.1.1`;
const feedKey = (patp) => `/feed/${patp}//~2000.1.1`;

export const refreshAll = () => {
  refreshPortalItems();
  refreshContacts();
  refreshApps();
  refreshGroups();
  refreshPals();
};
refreshAll();

import React, { useEffect, useState } from "react";
import { usePortal } from "../../state/usePortal";
import { EditGeneralForm } from "../../components/Form/EditGeneralForm";
import { defaultListUrl } from "../../utils/format";

export function Add() {
  const { ship } = usePortal();
  const [addListPoke, setAddListPoke] = useState(null);

  const defaultGeneral = {
    title: "",
    description: "",
    image: "",
    link: "",
    color: "",
    pictures: [],
    tags: [],
    properties: {},
  };

  const typesOfBespokeInput = {
    "list-list": "list-key-list",
    "list-nonitem-group": "group-key-list",
    "list-app": "app-key-list",
    "list-enditem-other": "other-key-list",
    "list-nonitem-ship": "ship-key-list",
  };

  useEffect(() => {
    if (!ship) return;
    setAddListPoke({
      add: {
        ship: `~${ship}`,
        type: "/list/nonitem/group",
        general: { ...defaultGeneral },
        "bespoke-input": { "list-nonitem-group": { "group-key-list": [] } },
      },
    });
  }, [ship]);

  const setType = e => {
    const typeKey = `list${e?.target?.value.replace(/\//g, "-")}`;
    const typePath = `/list${e?.target?.value}`;
    setAddListPoke({
      add: {
        type: typePath,
        "bespoke-input": { [typeKey]: { [typesOfBespokeInput[typeKey]]: [] } },
        general: addListPoke.add.general,
        ship: addListPoke.add.ship,
      },
    });
  };

  useEffect(() => {
    console.log({ addListPoke });
  }, [addListPoke]);

  const handleSave = e => {
    window.location = defaultListUrl(ship);
  };

  if (!addListPoke) return <></>;

  return (
    <div className="pt-12 w-full h-full">
      <div className="pb-12">
        <div className="text-4xl">adding new list</div>
      </div>
      <EditGeneralForm
        poke={addListPoke}
        setPoke={setAddListPoke}
        action="add"
        onSave={handleSave}
      />
      <div className="pt-4">
        <div>list of:</div>
        <select onChange={setType}>
          <option value="/nonitem/group">groups</option>
          <option value="/app">apps</option>
          <option value="/nonitem/ship">ships (other curators)</option>
          <option value="/enditem/other">other (web links etc.)</option>
        </select>
      </div>
    </div>
  );
}
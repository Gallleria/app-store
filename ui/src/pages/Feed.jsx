import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { sigil, reactRenderer } from "@tlon/sigil-js";
import { NavLink } from "react-router-dom";
import * as timeago from "timeago.js";
import { getFeedItems, useStore } from "@state/store";
import { useGroupState } from "@lib/state/groups/groups";
import {
  fromUrbitTime,
  getImage,
  getDescription,
  getShortTitle,
  getLongTitle,
  getType,
  getColor,
} from "@utils/format";
import { ItemImage } from "@components/Item/ItemImage";
import { ItemModal } from "@components/Item/ItemModal";

export const Feed = () => {
  const { groups } = useGroupState();
  const feed = useStore(getFeedItems);

  const renderSigil = patp => {
    return sigil({
      patp: patp?.length < "14" ? patp : "worpet-bildet",
      renderer: reactRenderer,
      size: "30",
      colors: ["black", "white"],
    });
  };

  const FeedItem = ({ item }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    if (groups[item.keyStr]) {
      setIsJoined(true);
    }
    const imageContainerRef = useRef();
    return (
      <div className="my-10">
        <div className="flex flex-col md:flex-row justify-between pb-1">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex flex-row items-center">
              <div className="mr-4">{renderSigil(item.ship)}</div>
              <NavLink to={`/${item.ship}`}>
                <span className="text-blue-500">{item.ship}</span>
              </NavLink>
            </div>
            <span className="pl-1"> recommended</span>
          </div>
          <div>{timeago.format(fromUrbitTime(item.time))}</div>
        </div>
        <div
          className="flex flex-row justify-between items-center p-0 md:p-5 rounded-xl cursor-pointer hover:bg-gray-500"
          onClick={() => setModalIsOpen(true)}
        >
          <div className="flex flex-col items-start md:flex-row md:items-center">
            <div className="flex flex-row items-center w-44 h-44" ref={imageContainerRef}>
              <ItemImage
                src={getImage(item.data)}
                patp={getType(item) === "ship" ? item.keyObj?.ship : null}
                type={getType(item)}
                name={getShortTitle(item)}
                container={imageContainerRef}
                color={getColor(item.data)}
              />
            </div>
            <div>
              <div className="md:ml-3">
                <div className="text-xl font-bold">{getShortTitle(item)}</div>
                <div>{getDescription(item)}</div>
              </div>
            </div>
          </div>
        </div>
        {getType(item) !== "ship" && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            ariaHideApp={false}
            contentLabel="Item Modal"
            style={{
              content: {
                position: "relative",
                margin: "20px",
                inset: 0,
                display: "none", // wtf
              },
            }}
          >
            <ItemModal
              title={getShortTitle(item)}
              path={getLongTitle(item)}
              description={getDescription(item)}
              image={getImage(item.data)}
              type={getType(item)}
              onRequestClose={() => setModalIsOpen(false)}
              data={item.data}
              buttonDisabled={isJoined}
            ></ItemModal>
          </Modal>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full p-12">
      <div className="text-2xl font-bold">Latest Activity</div>
      {feed.length === 0 ? (
        <>Loading...</>
      ) : (
        feed
          .map(f => f) // clone so we can sort
          .sort((a, b) => a.time - b.time)
          .map(f => {
            return f.data ? <FeedItem key={f.keyStr} item={f} /> : <></>;
          })
      )}
    </div>
  );
};
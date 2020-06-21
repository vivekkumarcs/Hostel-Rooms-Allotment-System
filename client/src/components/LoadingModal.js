import React from "react";
import Modal from "react-modal";
import load from "./loading3.gif";

const modalLoad = () => {
    return (
        <div>
            <Modal
                ariaHideApp={false}
                isOpen={true}
                contentLabel="selected"
                className="modalLoad"
            >
                <img src={load} alt="Loading..."></img>
            </Modal>
        </div>
    );
};
export default modalLoad;

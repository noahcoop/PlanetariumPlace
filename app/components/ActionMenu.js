import Modal from "@material-ui/core/Modal";
import React from "react";
import Close from "@material-ui/icons/Close";

export default function ActionMenu(props) {
  const { showActionMenu, setShowActionMenu } = props;
  return (
    <Modal open={showActionMenu}>
      <div
        style={{
          margin: "auto",
          marginTop: "10vh",
          top: 100,
          width: "200px",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            direction: "row",
            justifyContent: "space-between",
          }}
        >
          <div>Options</div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowActionMenu(false)}
          >
            <Close />
          </div>
        </div>
        <button onClick={() => alert("here")}>Download Map</button>
        <button onClick={() => alert("here")}>View Github</button>
      </div>
    </Modal>
  );
}

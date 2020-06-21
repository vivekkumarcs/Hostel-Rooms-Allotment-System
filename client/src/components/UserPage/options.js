import React from "react";

const Option = (props) => (
  <div className="roomoptions">
    <div className="listname">
      {" "}
      {props.position}. {props.roomText}
    </div>

    <div>
      {" "}
      <button
        className="movebuttonup"
        disabled={props.position === 1 ? true : false}
        onClick={(e) => {
          props.handleUpOption(props.roomText);
        }}
      ></button>
      <button
        className="movebuttondown"
        disabled={props.position === props.length ? true : false}
        onClick={(e) => {
          props.handleDownOption(props.roomText);
        }}
      ></button>
      <button
        className="movebuttoncancel"
        onClick={(e) => {
          props.handleDeleteOption(props.roomText);
        }}
      ></button>
    </div>
  </div>
);

export default Option;

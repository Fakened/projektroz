import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./ChildDataCard.scss";

// Define the props for the input data and the card component
interface DataInput {
  inputLabel: string;
  placeholder: string;
  type: "date" | "text";
  regex?: string;
}

interface DataCardProps {
  dataSets: DataInput[][];
  setters: React.Dispatch<React.SetStateAction<string>>[];
}

// DataCard component with integrated input fields
const DataCard: React.FC<DataCardProps> = ({ dataSets, setters }) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right"
  >("left");

  const nextSet = () => {
    setAnimationDirection("right");
    setCurrentSetIndex((prevIndex) =>
      Math.min(prevIndex + 1, dataSets.length - 1)
    );
  };

  const prevSet = () => {
    setAnimationDirection("left");
    setCurrentSetIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="data-card-wrapper">
      <div className="childData-card content-between">
        <button onClick={prevSet} type="button" className="btn-half">
          <img
            src="../src/assets/icons/previous-light.png"
            alt="Poprzedni zestaw"
            className="btn-icon"
          />
        </button>
        <TransitionGroup>
          {dataSets.map((dataSet, index) => (
            <CSSTransition
              key={index}
              classNames={`slide-${animationDirection}`}
              timeout={300}
            >
              <div
                style={{
                  visibility: currentSetIndex === index ? "visible" : "hidden",
                  opacity: currentSetIndex === index ? 1 : 0,
                  height: currentSetIndex === index ? "auto" : 0,
                  overflow: currentSetIndex === index ? "visible" : "hidden",
                  transition: "all 0.25s ease-out",
                }}
              >
                {dataSet.map((data, dataIndex) => (
                  <div className="childData-input" key={dataIndex}>
                    <h3>{data.inputLabel}</h3>
                    <input type={data.type} placeholder={data.placeholder} />
                  </div>
                ))}
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
        <button onClick={nextSet} type="button" className="btn-half">
          <img
            src="../src/assets/icons/next-light.png"
            alt="Następny zestaw"
            className="btn-icon"
          />
        </button>
      </div>
      <div className="scroll-progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${((currentSetIndex + 1) / dataSets.length) * 100}%`,
            transition: `width 0.3s ease-in-out`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default DataCard;

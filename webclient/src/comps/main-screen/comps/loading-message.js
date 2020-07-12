import React, { Component } from "react";
import { Progress } from "antd";
import { getRandomInt } from "../../../utils";

class LoadingStepSearchProgress extends Component {
  render() {
    const { nrTotal, nrComplete } = this.props;
    const percent = parseInt((nrComplete / nrTotal) * 100);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1
        }}
      >
        <div style={{ fontWeight: "bold", margin: "1rem" }}>
          Searching individual resources...
        </div>
        <Progress
          type={"circle"}
          percent={percent}
          format={() => `${nrComplete} / ${nrTotal}`}
          width={80}
        />
      </div>
    );
  }
}

class LoadingStepLinkProgress extends Component {
  state = { percent: 0 };
  componentDidMount() {
    const intervalId = setInterval(this.shuffleProgress, 750);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidCatch(error, errorInfo) {
    clearInterval(this.state.intervalId);
  }

  shuffleProgress = () => {
    if (this.props.isDone) {
      clearInterval(this.state.intervalId);
    } else {
      const newProgressValue = getRandomInt(1, 99);
      this.setState({ percent: newProgressValue });
    }
  };

  render() {
    const { isActive, isDone } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1
        }}
      >
        <div style={{ fontWeight: "bold", margin: "1rem" }}>
          Linking results...
        </div>
        <Progress
          type={"circle"}
          percent={
            !isActive && !isDone ? 0 : !isDone ? this.state.percent : 100
          }
          format={!isDone ? () => "?" : () => "OK"}
          width={80}
        />
      </div>
    );
  }
}

class LoadingStep extends Component {
  render() {
    const {
      step,
      loadingStep,
      isActive,
      isDone,
      nrTotal,
      nrComplete
    } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          opacity: !isActive && !isDone && "0.5",
          alignItems: "center"
        }}
      >
        Step {step + 1}
        {step === 0 && (
          <LoadingStepSearchProgress
            nrTotal={nrTotal}
            nrComplete={nrComplete}
          />
        )}
        {step === 1 && (
          <LoadingStepLinkProgress
            loadingStep={loadingStep}
            isActive={isActive}
            isDone={isDone}
          />
        )}
      </div>
    );
  }
}

class LoadingMessage extends Component {
  render() {
    const { loadingStep, nrTotal, nrComplete, nrOfSteps = 2 } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          margin: "1rem"
        }}
      >
        <LoadingStep
          isActive={loadingStep === 0}
          isDone={loadingStep !== 0}
          step={0}
          loadingStep={loadingStep}
          nrTotal={nrTotal}
          nrComplete={
            nrComplete === 0 || Boolean(nrComplete) ? nrComplete : nrTotal
          }
        />
        {nrOfSteps === 2 && (
          <LoadingStep
            isActive={loadingStep === 1}
            isDone={loadingStep === -1}
            step={1}
            loadingStep={loadingStep}
          />
        )}
      </div>
    );
  }
}

export default LoadingMessage;

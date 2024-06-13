import React from 'react';

class Workmanagerjs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      timerInterval: null,
      mouseTimer: null,
      displayText: '',
      percentage: 25
    };
  }

  startTimer = () => {
    const { startTime } = this.state;
    if (!startTime) {
      this.setState({
        startTime: new Date().getTime(),
        timerInterval: setInterval(this.updateDisplay, 1000),
        mouseTimer: setTimeout(this.showMouseMessage, 10000),
        displayText: '',
      });
    }
  }

  stopTimer = () => {
    const { timerInterval, mouseTimer } = this.state;
    clearInterval(timerInterval);
    clearTimeout(mouseTimer);
    this.setState({
      startTime: null,
      timerInterval: null,
      mouseTimer: null,
      displayText: '',
    });
  }

  updateDisplay = () => {
    const { startTime } = this.state;
    const currentTime = new Date().getTime();
    const elapsedTime = new Date(currentTime - startTime);
    const hours = elapsedTime.getUTCHours();
    const minutes = elapsedTime.getUTCMinutes();
    const seconds = elapsedTime.getUTCSeconds();
    this.setState({
      displayText: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    });
  }

  resetMouseTimer = () => {
    const { mouseTimer } = this.state;
    clearTimeout(mouseTimer);
    this.setState({
      mouseTimer: setTimeout(this.showMouseMessage, 10000),
    });
  }

  showMouseMessage = () => {
    this.setState({
      displayText: "Timer stopped due to inactivity",
    });
    this.stopTimer();
  }

  handleChangeEvent = (event) => {
    this.setState({
      percentage: event.target.value,
    });
  }

  render() {
    const { displayText, percentage } = this.state;
    return (
      <div>
        <div>
          <button id="startBtn" onClick={this.startTimer}>Start Timer</button>
          <button id="stopBtn" onClick={this.stopTimer}>Stop Timer</button>
        </div>
        <div id="display">{displayText}</div>
        <CircularProgressBar
          strokeWidth="10"
          sqSize="200"
          percentage={percentage}
        />
        <div>
          <input
            id="progressInput"
            type="range"
            min="0"
            max="100"
            step="1"
            value={percentage}
            onChange={this.handleChangeEvent}
          />
        </div>
      </div>
    );
  }
}

class CircularProgressBar extends React.Component {
  render() {
    const { sqSize, strokeWidth, percentage } = this.props;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle
          className="circle-background"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className="circle-progress"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
        <text
          className="circle-text"
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
        >
          {`${percentage}%`}
        </text>
      </svg>
    );
  }
}

export default Workmanagerjs;

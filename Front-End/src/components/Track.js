import React from "react";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount() {
    if (this.props.track !== null) {
      const child = this.props.track.attach();
      this.ref.current.classList.add(this.props.track.kind);
      this.ref.current.appendChild(child);
    }
  }
  render() {
    return <div className="track" ref={this.ref}></div>;
  }
}

export default Track;

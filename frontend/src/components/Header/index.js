import React, { Component } from 'react';
import '../../App.css';
import './style.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "Leon is aCool",
    }
  }

  render() {
    return (
          <div className="header">
            {this.props.title}
          </div>
    );
  }
}

export default Header;

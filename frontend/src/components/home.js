import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class Home extends Component {

    render() { 
      return ( 
        <main>
          <div id="chat" className="container">
            Hi Hi Hi!!!
          </div>
        </main>
      );
  }
}
 
export default withRouter(Home);
import React from 'react';
import logo from './logo.svg';
import './App.css';

console.log("here")

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Steven!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click this totally safe link
        </a>
        <Component message = "Hello...?"/>
      </header>
    </div>
  );
}

class Component extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {age: 20, height: 6} 
  }

  render() {
    return (
      <div>
        {this.props.message}
        {this.state.age}
        <div style = {{backgroundColor: "red"}} onClick={() => this.setState({age: this.state.age + 1})}>
          button
        </div>
      </div>
    );
  }
}


export default App;

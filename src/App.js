import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import { asn1 } from './parser/parser'

const certObj = asn1.toObject()
console.log( asn1.toObject() )

let res = [];

const recur = (obj, res) => {
  const { asn1Type, preview, warning = '' } = obj;
  // console.log(obj.childs.length);
  // (obj.childs.length === 0) ? console.log(asn1Type, preview) : null;
  // (obj.childs.length === 0) ? console.log(preview) : null;
  (obj.childs.length === 0) ? res.push(preview + ' ' + (warning.c||'') ) : null;
  (obj.childs.length > 0) ? obj.childs.map(subObj => recur(subObj, res)) : null;
  // return [ asn1Type, preview ]
  // console.log(res)
  return res
}

class App extends Component {
  render() {
    return (
      <div className="container">
        <hr/>
        <div>
          {recur(certObj, res).map((ele,i)=>
            <div key={i}>{(x=>"<span>&nbsp;</span>".repeat(i))}{ele}</div>
          )}
        </div>


        {/* <div className="card" style={{width: "20rem"}}>
          <div className="card-body">
            <h4 className="card-title">Card title</h4>
            {certObj.hexString.match(/.{1,32}/g).map((row, i)=>
              <div key={i} className="card-text">{row}</div>
            )}
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div> */}
      </div>
    );
  }
}

{/* <span>{certObj.asn1Type}</span><span className="mx-2">{certObj.preview}</span> */}

export default App;

import React, { Component } from "react";
import "../../../css/Library.scss";
import MapCard from "./MapCard";
import MapItem from "../MapItem";
import libData from "../../mock-data/libData";
import tagData from "../../mock-data/tagData";

import search from "../../../images/search.svg";

class LibraryState {
  constructor() {
    this.maps = [];
  }
}

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = new LibraryState();
  }
  componentDidMount() {
    fetch("/api/getAllMaps", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            maps: data.maps,
          });
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }
  render() {
    return (
      <div className="library-container">
        <div className="tag-whole-area">
          <h1 className="tag-header">Tags</h1>
          <div className="tag-section card">
            {tagData.tags.map((x) => (
              <span key={x} className="tag-link">
                {x}
              </span>
            ))}
          </div>
        </div>
        <div className="whole-map-section card flex flex-col flex-center">
          <div className="search-row flex flex-row">
            <input type="text" placeholder="Search..." className="searchbar" />
            <div className="search-button flex center-child">
              <img src={search} alt="Search" />
            </div>
          </div>
          <h1 style={{ textAlign: "center" }}>Popular Maps</h1>
          {this.state.maps.map((map) => (
            <MapItem
              key={map.uid}
              id={map.uid}
              title={map.title}
              creator={""}
              createdOn={new Date(map.createdOn)}
              rating={5}
              description={map.description}
              timesCompleted={map.times_completed}
              tags={JSON.parse(map.tags)}
              ratings={JSON.parse(map.ratings)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Library;

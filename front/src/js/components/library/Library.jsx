import React, { Component } from "react";
import "../../../css/Library.scss";
import MapItem from "../MapItem";
import libData from "../../mock-data/libData";
import tagData from "../../mock-data/tagData";

import search from "../../../images/search.svg";

// Stores the state data for the Library page,
// including the total list of maps, the visible maps,
// the current search value, and the list of active tags
class LibraryState {
  constructor() {
    this.maps = [];
    this.visibleMaps = [];
    this.activeTags = [];
    this.search = "";
  }
}

// Library component class for displaying the Library page
class Library extends Component {
  constructor(props) {
    super(props);
    this.state = new LibraryState();
  }

  // Runs after the component mounts on the page, makes an
  // API request to fetch all maps from the server and sets the
  // state to include these maps
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
            visibleMaps: data.maps,
          });
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // Called when a user clicks a tag in the tag container,
  // toggling which tags are used to filter the visible maps
  toggleActiveTag(tag) {
    let activeTags = [...this.state.activeTags];
    let index = activeTags.indexOf(tag);
    if (index === -1) {
      activeTags.push(tag);
    } else {
      activeTags.splice(index, 1);
    }

    // Refilter the visible maps after toggle
    this.setState({ activeTags }, () => {
      this.filter();
    });
  }

  // Event handler binding the search input to the state
  updateSearch(e) {
    this.setState({
      search: e.target.value,
    });
  }

  // Uses the search value and the active tags list to filter the visible
  // maps
  filter() {
    let allMaps = [...this.state.maps];
    let visibleMaps = [];

    // Iterate over all the maps
    allMaps.forEach((map) => {
      const mapTags = JSON.parse(map.tags);

      // Ensure the map includes all active tags being filtered for
      let hasAllTags = true;
      this.state.activeTags.forEach((tag) => {
        if (mapTags.indexOf(tag) === -1) {
          hasAllTags = false;
        }
      });

      // Map should have all the active tags to be seen
      if (hasAllTags) {
        if (this.state.search !== "") {
          // Check if the title, description, or creator includes
          // the string being searched for
          if (
            map.title.includes(this.state.search) ||
            map.description.includes(this.state.search) ||
            map.creator.includes(this.state.search)
          ) {
            visibleMaps.push(map);
          }
        } else {
          visibleMaps.push(map);
        }
      }
    });

    // Set the visible maps to be displayed
    this.setState({ visibleMaps });
  }

  // Handles when a user presses the enter key in the
  // search box to initiate the filters
  handleKeyDown(e) {
    if (e.which === 13) {
      this.filter();
    }
  }

  // Helper function to check if a given tag is active
  isActive(tag) {
    return this.state.activeTags.indexOf(tag) !== -1;
  }

  // Render the library page
  render() {
    return (
      <div className="library-container">
        <div className="tag-whole-area">
          <h1 className="tag-header">Tags</h1>
          <div className="tag-section card">
            {tagData.tags.map((x) => (
              <span
                key={x}
                className={"tag-link" + (this.isActive(x) ? " active" : "")}
                onClick={() => this.toggleActiveTag(x)}
              >
                {x}
              </span>
            ))}
          </div>
        </div>
        <div className="whole-map-section card flex flex-col flex-center">
          <div className="search-row flex flex-row">
            <input
              type="text"
              placeholder="Search..."
              className="searchbar"
              onChange={(e) => this.updateSearch(e)}
              onKeyDown={(e) => this.handleKeyDown(e)}
              value={this.state.search}
            />
            <div
              className="search-button flex center-child"
              onClick={() => this.filter()}
            >
              <img src={search} alt="Search" />
            </div>
          </div>
          <h1 style={{ textAlign: "center" }}>Popular Maps</h1>
          {this.state.visibleMaps.map((map) => (
            <MapItem
              key={map.uid}
              id={map.uid}
              title={map.title}
              creator={map.creator}
              createdOn={new Date(map.createdOn)}
              rating={5}
              description={map.description}
              timesCompleted={map.times_completed}
              tags={JSON.parse(map.tags)}
              reviews={map.reviews}
            />
          ))}
          {this.state.visibleMaps.length === 0 ? (
            <div className="no-maps">No maps!</div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Library;

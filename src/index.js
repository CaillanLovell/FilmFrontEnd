
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Collapsible from 'react-collapsible';
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { render } from "@testing-library/react";
import "./style.css";

class MovieGenreRow extends React.Component {
  render() {
    const genre = this.props.genre;

    return <tr>{/* <th colSpan="20">{genre}</th> */}</tr>;
  }
}

class MovieRow extends React.Component {
  
  render() {
    
    const rows = [];
    const moviedata = this.props.movieinfo;
    return (
      <>
      <table>
        <thead>
          <tr>
            <th> Title</th>
            <th> Rating </th>
            <th> Release Year</th>
            <th> Film ID</th>
          </tr>
        </thead>
        <tbody>     

        <td>{moviedata.title}</td>

      <td>{moviedata.rating}</td>

      <td>{moviedata.release_year}</td>

      <td>{moviedata.film_id}</td>

      </tbody>
      </table>
      <Collapsible trigger="Click for Actors">
      <p className="filmDataBottom">
          Actors:{""}
            {moviedata.actor.map((filmActor) => (
              <div>
                <ul>
                  <li>{filmActor.first_name + " " + filmActor.last_name} </li>
                </ul>
              </div>
          ))}
       </p>
       </Collapsible>

       <br></br>


      <Collapsible trigger="Click for Reviews">
      <p>
      Review:{" "}
      <table>
              <thead>
              <tr>
              <th> Review_id</th>
              <th> Review </th>
              <th> Rating</th>
              </tr>
              </thead>
            {moviedata.reviews.map((filmReview) => (
              
              <tbody>
              <tr>
              <td><div class="reviews">{filmReview.review_id}</div></td>
              <td><div class="reviews">{filmReview.review}</div></td>
              <td><div class="reviews">{filmReview.review_rating}/10</div></td>
              </tr>
              </tbody>
              
            ))}</table>
  
      </p>
      {/* <div>
          <button className="reviewButtons">Add Review</button>
          <button className="reviewButtons">Delete Review</button>
          <br />
        </div> */}
    </Collapsible>
    <hr></hr>
      </>
      
    );
  }
}


class MovieTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filmPackages: [] };
  }

  componentDidMount() {
    axios
      .get("http://35.177.223.132:8080/Home/Films")
      .then((response) => this.setState({ filmPackages: response.data }));
  }

  render() {
    const movie = this.state.filmPackages;
    const moviedata = this.props.movieinfo;
    const filterText = this.props.filterText.toLowerCase();

    const rows = [];
    this.state.filmPackages.forEach((movie) => {
      if (movie.title.toLowerCase().indexOf(filterText) === -1) {
        return;
      }
      console.log(movie);
      rows.push(<MovieRow movieinfo={movie} key={movie.film_id} />);
    });

    return (
      <div>
        <div>{rows}</div>
      </div>
    );
  }
}

class Post extends React.Component {
  cosntructor (){
    this.MovieRow = new MovieRow();
  }
  state = {
    film_id: "",
    review: "",
    rating: " ",
  };

  onFilmIDChange = (e) => {
    this.setState({
      film_id: e.target.value,
    });
  };

  onUserReviewChange = (e) => {
    this.setState({
      review: e.target.value,
    });
  };

  onStarRatingChange = (e) => {
    this.setState({
      rating: e.target.value,
    });
  };

  handleSubmit = (e) => {
    const moviedata = this.props.movieinfo;
    e.preventDefault();
    const data = {
      film_id: this.state.film_id,
      review: this.state.review,
      rating: this.state.rating,
    };
    console.log(data);
    axios
      .post(
        "http://35.177.223.132:8080/Home/addReviews?film_id=" +
          this.state.film_id +
          "&review=" +
          this.state.review +
          "&rating=" +
          this.state.rating
      )
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
      window.location.reload(false);
  };

  render() {
    return (
      <div className="post">
        <form className="post" onSubmit={this.handleSubmit}>
        <br></br>
        <label>
            Creating a Review:
          </label>
          <br></br>
        <input
            placeholder="Film ID"
            value={this.state.film_id}
            onChange={this.onFilmIDChange}
            required
          />
          <br></br>
          <input
            placeholder="Review"
            value={this.state.review}
            onChange={this.onUserReviewChange}
            required
          />
          <br></br>
          <input
            placeholder="Rating"
            value={this.state.rating}
            onChange={this.onStarRatingChange}
            required
          />
          <br></br>

          <button>Create Review</button>
        </form>
        <br></br>
      </div>
    );
  }
}

class Delete extends React.Component {
  state = {
    review_ID: "",
  };

  handleChange = (event) => {
    this.setState({ review_ID: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    axios
      .delete(
        `http://35.177.223.132:8080/Home/deleteReviews/${this.state.review_ID}`
      )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        window.location.reload(false);
      });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Deleting a Review:
            <br></br>
            <input placeholder="Review ID" type="text" name="Review ID" onChange={this.handleChange} />
          </label>
          <br></br>
          <button type="submit">Delete Review</button>
        </form>
      </div>
    );
  }
}

class PutRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      review_id: "",
      review: "",
      rating: " ",
      updatedAt: null,
    };
  }

  onReviewIDChange = (e) => {
    this.setState({
      review_id: e.target.value,
    });
  };

  onReviewChange = (e) => {
    this.setState({
      review: e.target.value,
    });
  };

  onRatingChange = (e) => {
    this.setState({
      rating: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    // PUT request using axios with error handling

    axios
      .put(
        "http://35.177.223.132:8080/Home/updateReviews/" +
          this.state.review_id +
          "?review=" +
          this.state.review +
          "&rating=" +
          this.state.rating
      )
      // .then((response) => {
      //   this.setState({ updatedAt: response.data.updatedAt }),
      //     console.log(response.data);
      // });
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
      window.location.reload(false);
  };

  render() {
    const { errorMessage } = this.state;
    return (
      <div className="put">
        <form className="put" onSubmit={this.handleSubmit}>
        <label>
        <br></br>
            Updating a Review:
          </label>
          <br></br>
          <input
            placeholder="Review ID"
            value={this.state.review_id}
            onChange={this.onReviewIDChange}
            required
          />
          <br></br>
          <input
            placeholder="Review"
            value={this.state.review}
            onChange={this.onReviewChange}
            required
          />
          <br></br>
          <input
          placeholder="Rating"
            value={this.state.rating}
            onChange={this.onRatingChange}
            required
          />
          <br></br>

          <button type="submit">Update Review</button>
        </form>
        <br></br>
      </div>
    );
  }
}


// class SiteNavigation extends React.Component {
//   render() {
//     return (
//       <div>
//         <Button variant="secondary">Update Review</Button>{" "}
//         <Button variant="success">Delete Review</Button>{" "}
//       </div>
//     );
//   }
// }



class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);}
    handleFilterTextChange(e) {
      this.props.onFilterTextChange(e.target.value);
    }
  render() {
    const filterText = this.props.filterText;
    return (
      <form>
         <input
          type="text"
          placeholder="Search Movie..."
          value={filterText}
          onChange={(userInput) =>
            this.props.onFilterTextChange(userInput.target.value)
          }
        />
        {/* <div className="Rating Dropdown">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Choose Rating
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">10</Dropdown.Item>
              <Dropdown.Item href="#/action-1">9</Dropdown.Item>
              <Dropdown.Item href="#/action-1">8</Dropdown.Item>
              <Dropdown.Item href="#/action-1">7</Dropdown.Item>
              <Dropdown.Item href="#/action-1">6</Dropdown.Item>
              <Dropdown.Item href="#/action-1">5 </Dropdown.Item>
              <Dropdown.Item href="#/action-1">4 </Dropdown.Item>
              <Dropdown.Item href="#/action-1">3 </Dropdown.Item>
              <Dropdown.Item href="#/action-1">2 </Dropdown.Item>
              <Dropdown.Item href="#/action-1">1 </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> */}
        {/* <p>
          Choose Category:{" "}
          <select name="category" id="category">
            <option value="" >
              Action
            </option>
            <option value="" >
              Fantasy
            </option>
            <option value="" >
              Other
            </option>
            <option value="" >
              Drama
            </option>
          </select>
        </p> */}
      </form>
    );
  }
}

class FilterableMovieTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  render() {
    return (
      <div>
          <h1 style={{backgroundColor: "lightblue"}}>Not Film Wiki!</h1>
          <p>Search for your Favourite films!</p>
          <SearchBar 
            filterText={this.state.filterText}
            onFilterTextChange={this.handleFilterTextChange}
          />
          <Post/>
          <Delete/>
          <PutRequest/>
        {/* <SiteNavigation /> */}
          <MovieTable
           movies={this.props.movies} 
           filterText={this.state.filterText}
           />
      </div>
    );
  }
}



ReactDOM.render(
  <FilterableMovieTable />,
  document.getElementById("root")
);
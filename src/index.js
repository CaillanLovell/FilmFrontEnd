
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Collapsible from 'react-collapsible';

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
       <Collapsible trigger="Click for Reviews">
      <p>
      Review:{" "}
            {moviedata.reviews.map((filmReview) => (<table>
              <thead>
              <tr>
              <th> Review_id</th>
              <th> Review </th>
              <th> Rating</th>
              </tr>
              </thead>
              <td><div class="reviews">{filmReview.review_id}</div></td>
              <td><div class="reviews">{filmReview.review}</div></td>
              <td><div class="reviews">{filmReview.review_rating}</div></td>
              </table>
            ))}
      </p>
      <div>
          <button className="reviewButtons">Add Review</button>
          <button className="reviewButtons">Delete Review</button>
          <br />
        </div>
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
      .get("http://18.170.63.7:8080/Home/Films")
      .then((response) => this.setState({ filmPackages: response.data }));
  }

  render() {
    const movie = this.state.filmPackages;
    const moviedata = this.props.movieinfo;

    const rows = [];
    this.state.filmPackages.forEach((movie) => {
      console.log(movie);
      rows.push(<MovieRow movieinfo={movie} key={movie.film_id} />);
    });

    return (
      <div>
        <div>{rows}</div>
        <div>
          <br />
          <button>Add Film</button>
        </div>
      </div>
    );
  }
}


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
        <input type="text" 
        placeholder="Search Films" 
        value={this.props.filterText} 
        onChange={this.handleFilterTextChange}
        />
        <p>
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
        </p>
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
          <h1 style={{backgroundColor: "lightblue"}}>Film Wiki!</h1>
          <p>Search for your Favourite films!</p>
          <SearchBar 
            filterText={this.state.filterText}
            onFilterTextChange={this.handleFilterTextChange}
          />
          <MovieTable
           movies={this.props.movies} 
           filterText={this.state.filterText}
           />
      </div>
    );
  }
}

const MOVIES = [
  {
    genre: "Action",
    title: "The Revengers",
    release_year: "2006",
  },

  {
    genre: "Crime",
    title: "Phone Phil",
    release_year: "2006",
  },

  {
    genre: "Noir",
    title: "The Mystery of the Kaltese Kite",
    release_year: "2006",
  },

  {
    genre: "Fantasy",
    title: "The Tiger, the Wizard and the Closet",
    release_year: "2006",
  },

  {
    genre: "Drama",
    title: "The problem in our Planets",
    release_year: "2006",
  },
];



ReactDOM.render(
  <FilterableMovieTable movies={MOVIES} />,
  document.getElementById("root")
);
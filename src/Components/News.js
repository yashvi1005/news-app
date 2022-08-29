import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
  const [articles, setArticles] = useState([]) 
  const [loading, setLoading] = useState(true) 
  const [page, setPage] = useState(1) 
  const [totalResults, settotalResults] = useState(0)  

 const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
 }
  

  const updateNews= async () =>  {
    props.setProgress(10)
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading( true );
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json();
    props.setProgress(70)
    setArticles(parsedData.articles)
    setLoading(false);
    settotalResults(parsedData.totalResults);
    props.setProgress(100)
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`
    updateNews();
    }, [])
  

  // const handlePrevClick = async () => {
  //   setPage(page - 1)
  //   updateNews();
  // };
  // const handleNextClick = async () => {
  //   setPage(page + 1)
  //   updateNews();
  // };

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page +1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    settotalResults(parsedData.totalResults)
  };


    return (
      <>
        <h2 className="text-center text-primary" style={{'marginTop':'100px'}}>
          NewsMonkey- Top {capitalizeFirstLetter(props.category)} Headlines 
        </h2>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}>
          
          <div className="container">

        <div className="row">
          {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={element.description ? element.description.slice(0, 88): ""}
                    imageUrl={element.urlToImage ? element.urlToImage : "https://c.ndtvimg.com/2022-08/7kf9l1l_katrina-kaif-_625x300_18_August_22.jpg"}
                    date={element.publishedAt ? element.publishedAt : ""}
                    source={element.source.name}
                    author={element.author ? element.author : "Unknown"}
                    className="card-img-top"
                    newsUrl={element.url}
                  />
                </div>
              );
            })}
        </div>
        </div>
        </InfiniteScroll>
        
      </>
    );
  
}

export default News;

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
};

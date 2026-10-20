import React, { useState, useEffect } from "react";
import "./index.css";

export const App = () => {
  
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ quote: "", author: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("https://dummyjson.com/quotes");
        const result = await response.json();
        setData(result.quotes || []);

      } catch (error) {
        console.error("Error fetching quotes:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, []);


  const addQuote = () => {
    if (!form.quote.trim() || !form.author.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newQuote = {
      id: data.length
        ? Math.max(...data.map((item) => item.id)) + 1
        : 1,
      quote: form.quote.trim(),
      author: form.author.trim(),
    };

    setData((prevData) => [...prevData, newQuote]);

    setForm({
      quote: "",
      author: "",
    });

    setSearch("");
    setPage(Math.ceil((data.length + 1) / 6));
    setShowForm(false);

    alert("Quote added successfully!");
  };

  const usersPerPage = 6;
  const filteredData = data.filter((items) =>
    items.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const lastIndex = page * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = filteredData.slice(firstIndex, lastIndex);

  return (
    <div className="main">
      <h1>Motivational Quotes</h1>

      <div className="search">
        <button
          onClick={() => setShowForm(!showForm)}
          className="add"
        >
          {showForm ? "Close Form ✕" : "+ Add Quote"}
        </button>

        <input
          type="text"
          placeholder="Search Quote By Author..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            
          }}
        />
      </div>
      {showForm && (
        <div className="add-quote">
          <h2>Add New Quote</h2>

          <input
            type="text"
            placeholder="Enter quote"
            value={form.quote}
            onChange={(e) =>
              setForm({ ...form, quote: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Enter author"
            value={form.author}
            onChange={(e) =>
              setForm({ ...form, author: e.target.value })
            }
          />

          <button onClick={addQuote}>Add Quote</button>
        </div>
      )}
      
      <div className="container">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading quotes...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <p className="no-results">No quotes found!</p>
        ) : (
          currentUsers.map((items) => (
            <div className="card" key={items.id}>
              <h4>Quote #{items.id}</h4>
              <h4>{items.quote}</h4>
              <h4>{items.author}</h4>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={page === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
import React from 'react'
import {
  Form,
} from 'react-bootstrap'

export default function SearchBar(props) {

  function handleSearch(event) {
    event.preventDefault()
    props.setQuery(event.target.formSearch.value.toLowerCase())
  }

  function renderSearchBar() {
    return(
      <Form className="form-inline" onSubmit={(event) => handleSearch(event)}>
        <Form.Group controlId="formSearch">
          <Form.Control 
            size="sm"
            type="search" 
            placeholder="Search"
          />
        </Form.Group>
      </Form>
    )
  }
  return (
    <div>
      {renderSearchBar()}
    </div>
  )
}

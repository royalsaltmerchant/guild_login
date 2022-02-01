import { Form, Button } from "react-bootstrap"

export default function EditSingleItem({typeOfEdit, toggle, inputType, handleEdit, item, setItem}) {
  function handleEditSingleItem(event) {
    event.preventDefault()
    const data = event.target[typeOfEdit].value.trim()
    const params = {
      [typeOfEdit]: data
    }
    handleEdit({params: params, typeOfEdit: typeOfEdit, toggle: toggle})
  }

  if(inputType === 'textarea') {
    return(
      <Form className="d-flex flex-row" onSubmit={(event) => handleEditSingleItem(event)}>
        <Form.Group controlId={typeOfEdit}>
          <Form.Control 
            required
            as={inputType}
            rows={10}
            cols={80}
            size="sm"
            value={item}
            onChange={(event) => setItem(event.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="link">Complete</Button>
      </Form>
    )
  } else return(
    <Form className="d-flex flex-row" onSubmit={(event) => handleEditSingleItem(event)}>
      <Form.Group controlId={typeOfEdit}>
        <Form.Control 
          required
          size="sm"
          type={inputType}
          value={item}
          onChange={(event) => setItem(event.target.value)}
        />
      </Form.Group>
      <Button type="submit" variant="link">Complete</Button>
    </Form>
  )
}
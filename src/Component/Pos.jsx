import React, { useState } from "react";
import { Button, Card, Image, Form, Row, Col, Container, Navbar, Nav, Pagination, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import products from "../assets/Product";
import qrCode from "../assets/dummy-qr.png";

const POSApp = () => {
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [priceFilter, setPriceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const modifyCart = (item, increment) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.name]) {
        newCart[item.name].quantity += increment;
        if (newCart[item.name].quantity <= 0) delete newCart[item.name];
      } else if (increment > 0) {
        newCart[item.name] = { ...item, quantity: 1 };
        toast.success(`${item.name} added to cart!`);
      }
      return newCart;
    });
  };

  const checkout = () => {
    if (!Object.keys(cart).length) return toast.error("Cart is empty!");
    setShowModal(true);
    setTimeout(() => {
      toast.success("Payment Successful! Order Placed.");
      setShowModal(false);
      setCart({});
    }, 3000);
  };

  const calculateTotal = () => Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && (!priceFilter || p.price <= +priceFilter))
    .sort((a, b) => (sortType === "price" ? a.price - b.price : a.name.localeCompare(b.name)))
    .slice((currentPage - 1) * 4, currentPage * 4);

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-lg">
        <Container>
          <Navbar.Brand>POS System</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link>Home</Nav.Link>
            <Nav.Link>Features</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <ToastContainer />
        <h2 className="text-center text-primary">POS System</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="p-4 shadow-sm border-primary">
              <h4>Customer Info</h4>
              <Form.Control placeholder="Enter name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mb-3" />
              <h4>Search & Filters</h4>
              <Form.Control placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-2" />
              <Form.Control placeholder="Max Price" type="number" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="mb-2" />
              <Form.Select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </Form.Select>
            </Card>
          </Col>

          <Col md={8}>
            <Row>
              {filteredProducts.map((item, i) => (
                <Col xs={6} md={4} key={i} className="text-center mb-3">
                  <Card className="p-2 shadow-sm text-center">
                    <Image src={item.src} alt={item.name} width={180} height={180} rounded className="mx-auto d-block" />
                    <Button className="mt-2 btn-sm" variant="success" onClick={() => modifyCart(item, 1)}>
                      {item.name} - ${item.price}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination className="mt-3">
              {Array.from({ length: Math.ceil(products.length / 4) }, (_, i) => (
                <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>

        <Card className="p-4 shadow-sm border-primary mt-4">
          <h4>Shopping Cart</h4>
          {Object.keys(cart).length === 0 ? (
            <p className="text-muted">Your cart is empty</p>
          ) : (
            <ul className="list-group">
              {Object.values(cart).map((item, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{item.name} - ${item.price} x {item.quantity}</span>
                  <Button variant="danger" size="sm" onClick={() => modifyCart(item, -1)}>Remove</Button>
                </li>
              ))}
            </ul>
          )}
          <h5 className="mt-3">Total: ${calculateTotal()}</h5>
          <Button variant="danger" className="mt-3" onClick={() => setCart({})}>Clear Cart</Button>
          <Button variant="success" className="mt-3 ml-2" onClick={checkout}>Checkout</Button>
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Scan QR Code to Pay</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={qrCode} alt="Dummy QR Code" width={200} />
          <p className="mt-3">Processing payment... Please wait</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default POSApp;
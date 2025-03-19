import React, { useState } from "react";
import { Button, Card, Image, Form, Row, Col, Container, Navbar, Nav, Pagination, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import products from "../assets/Product";
import qrCode from "../assets/dummy-qr.png"; // Import a dummy QR code image

const itemsPerPage = 4;

function POSApp() {
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [priceFilter, setPriceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.name]) {
        newCart[item.name].quantity += 1;
      } else {
        newCart[item.name] = { ...item, quantity: 1 };
      }
      toast.success(`${item.name} added to cart!`);
      return newCart;
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.name]) {
        if (newCart[item.name].quantity > 1) {
          newCart[item.name].quantity -= 1;
        } else {
          delete newCart[item.name];
        }
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
    toast.info("Cart cleared!");
  };

  const checkout = () => {
    if (Object.keys(cart).length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    setShowModal(true);
    setPaymentProcessing(true);
    setTimeout(() => {
      toast.success("Payment Successful! Order Placed.");
      setShowModal(false);
      setCart({});
    }, 3000);
  };

  const calculateTotal = () => {
    return Object.values(cart)
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortType === "price" ? a.price - b.price : a.name.localeCompare(b.name);
  });

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!priceFilter || product.price <= Number(priceFilter))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-lg">
        <Container>
          <Navbar.Brand href="#">POS System</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Features</Nav.Link>
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
              <Form.Control type="text" placeholder="Enter name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mb-3" />
              
              <h4>Search & Filters</h4>
              <Form.Control type="text" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-2" />
              <Form.Control type="number" placeholder="Max Price" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="mb-2" />
              <Form.Select value={sortType} onChange={(e) => setSortType(e.target.value)} className="mb-3">
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </Form.Select>
            </Card>
          </Col>

          <Col md={8}>
            <Row>
              {paginatedProducts.map((item, index) => (
                <Col xs={6} md={4} key={index} className="text-center mb-3">
                  <Card className="p-2 shadow-sm text-center">
                    <Image src={item.src} alt={item.name} width={180} height={180} rounded className="mx-auto d-block" />
                    <Button className="mt-2 btn-sm" variant="success" onClick={() => addToCart(item)}>
                      {item.name} - ${item.price}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>

            <Pagination className="mt-3">
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>

        <Card className="p-4 shadow-sm border-primary mt-4">
          <h4>Shopping Cart</h4>
          {Object.values(cart).length === 0 ? <p className="text-muted">Your cart is empty</p> : (
            <ul className="list-group">
              {Object.values(cart).map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{item.name} - ${item.price} x {item.quantity}</span>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item)}>Remove</Button>
                </li>
              ))}
            </ul>
          )}
          <h5 className="mt-3">Total: ${calculateTotal()}</h5>
          <Button variant="danger" className="mt-3" onClick={clearCart}>Clear Cart</Button>
          <Button variant="success" className="mt-3 ml-2" onClick={checkout}>Checkout</Button>
        </Card>
      </Container>

      {/* Payment Modal */}
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
}

export default POSApp;

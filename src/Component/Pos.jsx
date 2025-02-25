import React, { useState } from "react";
import { Button, Card, Image, Form, Row, Col, Container, Navbar, Nav } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import appleImg from "../assets/img/apple.jpeg";
import bananaImg from "../assets/img/banana.png";
import brinjalImg from "../assets/img/brinjal.jpeg";
import broccoliImg from "../assets/img/broccoli.jpeg";
import capsicumImg from "../assets/img/capcicum.jpeg";
import carrotImg from "../assets/img/carrot.jpg";
import cherryImg from "../assets/img/cherry.png";
import grapesImg from "../assets/img/graphes.jpeg";
import guavaImg from "../assets/img/guava.png";
import mushroomImg from "../assets/img/mashroom.png";
import onionImg from "../assets/img/onion.jpg";
import pineappleImg from "../assets/img/pineapple.png";
import redChillyImg from "../assets/img/red-chilly.jpeg";
import strawberryImg from "../assets/img/strawberry.jpg";
import tomatoImg from "../assets/img/tomato.png";

const products = [
  { name: "Apple", price: 10, src: appleImg },
  { name: "Banana", price: 7, src: bananaImg },
  { name: "Brinjal", price: 20, src: brinjalImg },
  { name: "Broccoli", price: 30, src: broccoliImg },
  { name: "Capsicum", price: 8, src: capsicumImg },
  { name: "Carrot", price: 15, src: carrotImg },
  { name: "Cherry", price: 70, src: cherryImg },
  { name: "Grapes", price: 10, src: grapesImg },
  { name: "Guava", price: 15, src: guavaImg },
  { name: "Mushroom", price: 100, src: mushroomImg },
  { name: "Onion", price: 45, src: onionImg },
  { name: "Pineapple", price: 20, src: pineappleImg },
  { name: "Red Chilly", price: 15, src: redChillyImg },
  { name: "Strawberry", price: 40, src: strawberryImg },
  { name: "Tomato", price: 25, src: tomatoImg },
];

function POSApp() {
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const addToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.name]) {
        newCart[item.name].quantity += 1;
      } else {
        newCart[item.name] = { ...item, quantity: 1 };
      }
      if (!newCart[item.name].toastShown) {
        toast.success(`${item.name} added to cart!`, { toastId: item.name });
        newCart[item.name].toastShown = true;
      }
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
    toast.success(`Thank you for your purchase, ${customerName}!`);
    setCart({});
    setCustomerName("");
  };

  const calculateTotal = () => {
    return Object.values(cart)
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">POS Application</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <ToastContainer />
        <h1 className="mb-4 text-center">POS Application</h1>
        <Row>
          <Col md={6}>
            <Card className="p-4 shadow-lg mb-4">
              <h4>Enter Customer Name</h4>
              <Form.Control 
                type="text" 
                placeholder="Enter name" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-3"
              />
              <h4>Search for an item</h4>
              <Form.Control 
                type="text" 
                placeholder="Search" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
              />
              <h4>Select an item</h4>
              <Row className="mt-3">
                {filteredProducts.map((item, index) => (
                  <Col xs={6} md={4} lg={3} key={index} className="text-center mb-3">
                    <Image src={item.src} alt={item.name} width={80} height={80} rounded />
                    <Button className="mt-2" variant="primary" onClick={() => addToCart(item)}>
                      {item.name} - ${item.price}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 shadow-lg">
              <h4>Shopping Cart</h4>
              {Object.values(cart).length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul className="list-group">
                  {Object.values(cart).map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {item.name} - ${item.price} x {item.quantity}
                      </div>
                      <div>
                        ${(item.price * item.quantity).toFixed(2)}
                        <Button variant="danger" size="sm" className="ml-2" onClick={() => removeFromCart(item)}>
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <h5 className="mt-3">Total: ${calculateTotal()}</h5>
              <Button variant="warning" className="mt-3" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button variant="success" className="mt-3 ml-2" onClick={checkout}>
                Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <Container>
          <p>&copy; 2023 POS Application. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
}

export default POSApp;

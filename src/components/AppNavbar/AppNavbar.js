import React, { useState } from 'react';
import "./AppNavbar.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
  ButtonGroup
} from 'reactstrap';


const AppNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md" >
        <NavbarBrand  href="/">Path Simulator</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem id={"Tooltip-" + 6}>
              <NavLink href="https://github.com/AmitHalpert/path-simulator">GitHub</NavLink>
            </NavItem>
            <UncontrolledDropdown  nav inNavbar>
              <DropdownToggle id={"Tooltip-" + 5} nav caret>
                Algorithms
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Button onClick={() => { props.handleDijkstra(); props.handleVisualization() }}>Dijkstra</Button>
                </DropdownItem>
                <DropdownItem>
                  <Button onClick={() => { props.handleDFS(); props.handleVisualization() }}>DFS</Button>              
                </DropdownItem>
                <DropdownItem>
                  <Button onClick={() => { props.handleBFS(); props.handleVisualization() }}>BFS</Button>
                </DropdownItem>
                <DropdownItem>
                  <Button onClick={() => { props.handleAstar(); props.handleVisualization() }}>A*</Button>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle id={"Tooltip-" + 4} nav caret>
                Generate Maze
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Button onClick={() => { props.handleMaze(); props.handleVisualization() }}>Recursive Division</Button>
                </DropdownItem>
                <DropdownItem>
                    <Button onClick={props.handleRandomMaze}>Random Maze</Button>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>  
        </Collapse>
        <NavbarText id={"Tooltip-" + 3}>
          
        </NavbarText>
        <NavbarText className="clear-functions">
          <ButtonGroup>
            <Button id={"Tooltip-" + 0} onClick={props.handleClearPath}>Clear Path</Button>
            <Button id={"Tooltip-" + 1} onClick={props.handleClearMatrix}>Clear Matrix</Button>
          </ButtonGroup>          
        </NavbarText>
        <NavbarText id={"Tooltip-" + 2}>
        </NavbarText>
      </Navbar>
    </div>
  );
}

export default AppNavbar;
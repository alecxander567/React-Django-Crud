import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Table, Button, Spinner, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import './Homepage.css';
import { useNavigate } from "react-router-dom";

function Homepage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetch('http://localhost:8000/api/users/', {
                credentials: 'include',  
            })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log('Fetched users:', data);
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching users:', err);
                setLoading(false);
            });
        }, []);

        const handleLogout = async () => {
            try {
            const response = await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/');
            } else {
                alert('Logout failed');
            }
            } catch (error) {
            alert('Logout error: ' + error.message);
            }
        };

        return (
           <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="py-5 dark-theme-background text-white min-vh-100"
                >
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>User Accounts</h1>
                    <Button variant="outline-light" onClick={handleLogout}>
                        Logout
                    </Button>
                    </div>

                    {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="light" />
                    </div>
                    ) : (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Table striped bordered hover responsive variant="dark" className="shadow">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Username</th>  {/* new column */}
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2">Edit</Button>
                                    <Button variant="danger" size="sm">Delete</Button>
                                </td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
                    </motion.div>
                    )}
                </Container>
            </motion.div>
        );
    }

export default Homepage;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Table, Button, Spinner, Container, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import './Homepage.css';
import { useNavigate } from "react-router-dom";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function Homepage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleModalClose = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const fetchUsers = () => {
        setLoading(true);
        fetch('http://localhost:8000/api/users/', {
            credentials: 'include',
        })
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then((data) => {
            setUsers(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error('Error fetching users:', err);
            setLoading(false);
        });
    };

    const handleUpdateUser = async () => {
        console.log('=== handleUpdateUser started ===');
        console.log('selectedUser:', selectedUser);
        
        if (!selectedUser || !selectedUser.id) {
            alert('Error: No user selected or missing user ID');
            return;
        }

        try {
            const url = `http://localhost:8000/users/${selectedUser.id}/edit/`;
            
            const requestData = {
                username: selectedUser.username,
                email: selectedUser.email,
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });

            console.log('Response received');
            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);

            if (response.ok) {
                const data = await response.json();
                console.log('Success response:', data);
                alert('User updated successfully!');
                setShowEditModal(false);
                fetchUsers(); 
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert(`Failed to update user. Status: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Exception caught:', error);
            alert(`Error updating user: ${error.message}`);
        }
        
        console.log('=== handleUpdateUser finished ===');
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'), // Added CSRF token
                    },
                    credentials: 'include',
                });

                if (response.status === 204) { 
                    setUsers(users.filter(user => user.id !== userToDelete.id)); 
                    console.log(`User with ID ${userToDelete.id} deleted successfully.`);
                    alert(`User "${userToDelete.username}" deleted successfully!`);
                } else if (response.status === 404) {
                    console.error("User not found for deletion.");
                    alert("Error: User not found.");
                } else {
                    const errorText = await response.text();
                    console.error('Failed to delete user:', response.status, response.statusText, errorText);
                    alert(`Failed to delete user. Status: ${response.status} - ${response.statusText}. Details: ${errorText.substring(0, 100)}...`);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert(`Network error or problem deleting user: ${error.message}`);
            } finally {
                setShowDeleteConfirm(false);
                setUserToDelete(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    };

    useEffect(() => {
        fetchUsers();
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
        <>
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
                                        <th>Username</th>
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
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </Button>
                                                                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    Delete
                                                </Button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </motion.div>
                    )}
                </Container>
            </motion.div>

            <Modal show={showEditModal} onHide={handleModalClose} contentClassName="bg-dark text-white">
            <Modal.Header closeButton className="border-0">
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                    <Form>
                        <Form.Group className="mb-3">
                        <Form.Label className="text-white">Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={selectedUser.username || ''}
                            onChange={handleInputChange}
                            className="bg-dark text-white border-secondary"
                        />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label className="text-white">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={selectedUser.email || ''}
                            onChange={handleInputChange}
                            className="bg-dark text-white border-secondary"
                        />
                        </Form.Group>
                    </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={handleModalClose}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateUser}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteConfirm} onHide={handleCancelDelete} data-bs-theme="dark">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete user **{userToDelete?.username}**? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Homepage;
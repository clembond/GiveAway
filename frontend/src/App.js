// ---- frontend/src/App.js ----
// This file now manages routing, persistent login, and the main layout with a sidebar.
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, Flex, FormControl, FormLabel, Heading, Image, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Select, Stat, StatLabel, StatNumber, SimpleGrid, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Tag, Text, useDisclosure, VStack, InputGroup, InputRightElement,
  Progress, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  DrawerCloseButton, useBreakpointValue, Menu, MenuButton, MenuList, MenuItem, Divider, useToast
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

// --- Helper Components ---
const PasswordStrengthMeter = ({ password }) => {
    const getStrength = () => {
        let score = 0;
        if (password.length > 7) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;
        return score;
    };
    const strength = getStrength();
    const color = ['red', 'orange', 'yellow', 'blue', 'green'][strength - 1] || 'gray';
    const value = (strength / 5) * 100;
    return <Progress value={value} size="xs" colorScheme={color} borderRadius="md" />;
};

const ViewPasswordIcon = ({ show, onClick }) => (
    <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={onClick}>{show ? 'Hide' : 'Show'}</Button>
    </InputRightElement>
);

// --- Page Components ---
const LoginPage = ({ navigateTo, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            
            onLoginSuccess(data.user, data.accessToken);
        } catch (err) {
            toast({
                title: 'Login Failed',
                description: err.message || "Could not connect to the server. Is it running?",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            <Box maxW="md" w="full" bg="white" p={8} rounded="xl" shadow="lg">
                <Heading as="h2" size="xl" textAlign="center" color="#073B4C" mb={2}>GiveAway</Heading>
                <Text textAlign="center" color="gray.600" mb={8}>Welcome Back</Text>
                <form onSubmit={handleLogin}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email Address</FormLabel>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
                                <ViewPasswordIcon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                            </InputGroup>
                        </FormControl>
                        <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading}>Login</Button>
                    </VStack>
                </form>
                <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
                    Don't have an account? <Button variant="link" colorScheme="blue" onClick={() => navigateTo('register')}>Sign up</Button>
                </Text>
            </Box>
        </Flex>
    );
};

const RegisterPage = ({ navigateTo }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const registerData = {
            firstName: e.target.elements.firstName.value,
            lastName: e.target.elements.lastName.value,
            email: e.target.elements['reg-email'].value,
            password: e.target.elements['reg-password'].value,
            accountType: e.target.elements.accountType.value.split(' ')[0],
        };

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            
            toast({
                title: 'Account created.',
                description: "We've created your account for you. Please log in.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigateTo('login');
        } catch (err) {
            toast({
                title: 'Registration Failed',
                description: err.message || "Could not connect to the server. Is it running?",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            <Box maxW="md" w="full" bg="white" p={8} rounded="xl" shadow="lg">
                <Heading as="h2" size="xl" textAlign="center" color="#073B4C" mb={2}>Create Your Account</Heading>
                <form onSubmit={handleRegister}>
                    <VStack spacing={4} mt={8}>
                        <SimpleGrid columns={2} spacing={4} w="full">
                            <FormControl isRequired><FormLabel>First Name</FormLabel><Input id="firstName" /></FormControl>
                            <FormControl isRequired><FormLabel>Last Name</FormLabel><Input id="lastName" /></FormControl>
                        </SimpleGrid>
                        <FormControl isRequired><FormLabel>Email Address</FormLabel><Input type="email" id="reg-email" /></FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} id="reg-password" value={password} onChange={e => setPassword(e.target.value)} />
                                <ViewPasswordIcon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                            </InputGroup>
                            <PasswordStrengthMeter password={password} />
                        </FormControl>
                        <FormControl isRequired><FormLabel>I am a(n)...</FormLabel>
                            <Select id="accountType">
                                <option>Individual / Influencer</option>
                                <option>Corporation / Brand</option>
                                <option>Bank / Fintech</option>
                            </Select>
                        </FormControl>
                        <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading}>Create Account</Button>
                    </VStack>
                </form>
                <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
                    Already have an account? <Button variant="link" colorScheme="blue" onClick={() => navigateTo('login')}>Login</Button>
                </Text>
            </Box>
        </Flex>
    );
};

const DashboardPage = () => {
    return (
        <Container maxW="container.xl" p={{ base: 4, sm: 6, lg: 8 }}>
            <Heading as="h2" size="xl" color="#073B4C" mb={8}>Dashboard</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                <Stat bg="white" p={6} rounded="lg" shadow="md"><StatLabel>Total Giveaways</StatLabel><StatNumber color="#073B4C">12</StatNumber></Stat>
                <Stat bg="white" p={6} rounded="lg" shadow="md"><StatLabel>Total Amount Given</StatLabel><StatNumber color="#073B4C">₦15,200,000</StatNumber></Stat>
                <Stat bg="white" p={6} rounded="lg" shadow="md"><StatLabel>Total Participants</StatLabel><StatNumber color="#073B4C">250,000+</StatNumber></Stat>
            </SimpleGrid>
            <Box bg="white" p={8} rounded="lg" shadow="md">
                <Heading as="h3" size="lg" color="#073B4C" mb={4}>Welcome!</Heading>
                <Text>This is your main dashboard. Use the menu on the left to navigate to other sections like Campaigns or your Profile.</Text>
            </Box>
        </Container>
    );
};

const CampaignsPage = ({ user, authToken }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [mode, setMode] = useState('Random');
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('/api/campaigns', {
                    headers: { 'x-access-token': authToken }
                });
                const data = await response.json();
                if (response.ok) {
                    setCampaigns(data);
                } else {
                    throw new Error(data.message || 'Failed to fetch campaigns');
                }
            } catch (err) {
                toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
            }
        };
        if (authToken) {
            fetchCampaigns();
        }
    }, [authToken, toast]);
    
    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const campaignData = {
            title: e.target.elements.title.value,
            totalAmount: e.target.elements.totalAmount.value,
            amountPerWinner: e.target.elements.amountPerWinner.value,
            mode: e.target.elements.giveawayMode.value,
            duration: e.target.elements.duration ? e.target.elements.duration.value : null,
        };

        try {
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': authToken },
                body: JSON.stringify(campaignData)
            });
            const newCampaign = await response.json();
            if (!response.ok) throw new Error(newCampaign.message || 'Failed to create campaign');
            
            setCampaigns([...campaigns, newCampaign]);
            toast({ title: 'Success!', description: 'Your campaign has been created.', status: 'success', duration: 5000, isClosable: true });
            onClose();
        } catch (err) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.xl" p={{ base: 4, sm: 6, lg: 8 }}>
            <Flex justify="space-between" align="center" mb={8}>
                <Heading as="h2" size="xl" color="#073B4C">Manage Campaigns</Heading>
                <Button colorScheme="blue" onClick={onOpen}>Create New Giveaway</Button>
            </Flex>
            <TableContainer bg="white" rounded="lg" shadow="md">
                <Table variant="simple">
                    <Thead bg="gray.50"><Tr><Th>Campaign</Th><Th>Status</Th><Th>Winners</Th><Th>Date</Th></Tr></Thead>
                    <Tbody>
                        {campaigns.map((c, i) => (
                            <Tr key={i}>
                                <Td fontWeight="medium">{c.title}</Td>
                                <Td><Tag colorScheme={c.status === 'Completed' ? 'green' : 'blue'}>{c.status}</Tag></Td>
                                <Td>{c.numberOfWinners}</Td>
                                <Td>{new Date(c.createdAt).toLocaleDateString()}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a New Giveaway</ModalHeader><ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleCreateCampaign}>
                            <VStack spacing={4}>
                                <FormControl isRequired><FormLabel>Campaign Title</FormLabel><Input id="title" /></FormControl>
                                <FormControl isRequired><FormLabel>Total Giveaway Amount (₦)</FormLabel><Input id="totalAmount" type="number" /></FormControl>
                                <FormControl isRequired><FormLabel>Amount per Winner (₦)</FormLabel><Input id="amountPerWinner" type="number" /></FormControl>
                                <FormControl><FormLabel>Giveaway Mode</FormLabel>
                                    <Select id="giveawayMode" value={mode} onChange={e => setMode(e.target.value)}>
                                        <option value="Random">Random Selection</option>
                                        <option value="FCFS">First Come, First Served</option>
                                    </Select>
                                </FormControl>
                                {mode === 'Random' && <FormControl><FormLabel>Campaign Duration (minutes)</FormLabel><Input id="duration" type="number" /></FormControl>}
                                <Button type="submit" colorScheme="blue" w="full" mt={4} isLoading={isLoading}>Launch Campaign</Button>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

const ProfilePage = ({ user, authToken }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const currentPassword = e.target.elements.currentPassword.value;
        const newPassword = e.target.elements.newPassword.value;

        try {
            const response = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': authToken },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to change password');

            toast({ title: 'Success!', description: 'Your password has been updated.', status: 'success', duration: 5000, isClosable: true });
            e.target.reset();
        } catch (err) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.xl" p={{ base: 4, sm: 6, lg: 8 }}>
            <Heading as="h2" size="xl" color="#073B4C" mb={8}>My Profile</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <VStack as="form" spacing={4} align="stretch" bg="white" p={8} rounded="lg" shadow="md">
                    <Heading as="h3" size="md" mb={4}>Personal Information</Heading>
                    <FormControl isRequired><FormLabel>First Name</FormLabel><Input defaultValue={user?.firstName} /></FormControl>
                    <FormControl isRequired><FormLabel>Last Name</FormLabel><Input defaultValue={user?.lastName} /></FormControl>
                    <FormControl isReadOnly><FormLabel>Email Address</FormLabel><Input type="email" value={user?.email} /></FormControl>
                    <Button type="submit" colorScheme="blue" mt={4}>Save Changes</Button>
                </VStack>
                <VStack as="form" onSubmit={handlePasswordChange} spacing={4} align="stretch" bg="white" p={8} rounded="lg" shadow="md">
                    <Heading as="h3" size="md" mb={4}>Change Password</Heading>
                    <FormControl isRequired><FormLabel>Current Password</FormLabel><Input id="currentPassword" type="password" /></FormControl>
                    <FormControl isRequired>
                        <FormLabel>New Password</FormLabel>
                        <InputGroup>
                            <Input id="newPassword" type={showPassword ? 'text' : 'password'} />
                            <ViewPasswordIcon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                        </InputGroup>
                    </FormControl>
                    <Button type="submit" colorScheme="blue" mt={4} isLoading={isLoading}>Update Password</Button>
                </VStack>
            </SimpleGrid>
        </Container>
    );
};

// --- Layout Components ---
const SidebarContent = ({ navigateTo, onLogout, onClose }) => (
    <VStack spacing={2} align="stretch" p={4}>
        <Button variant="ghost" justifyContent="start" onClick={() => { navigateTo('dashboard'); onClose(); }}>Dashboard</Button>
        <Button variant="ghost" justifyContent="start" onClick={() => { navigateTo('campaigns'); onClose(); }}>Campaigns</Button>
        <Button variant="ghost" justifyContent="start" onClick={() => { navigateTo('profile'); onClose(); }}>Profile</Button>
        <Button variant="ghost" justifyContent="start" onClick={() => { alert('Billing Page'); onClose(); }}>Billing</Button>
        <Button variant="ghost" justifyContent="start" onClick={() => { alert('Settings Page'); onClose(); }}>Settings</Button>
        <Divider my={4} />
        <Button variant="ghost" justifyContent="start" colorScheme="red" onClick={onLogout}>Logout</Button>
    </VStack>
);

const MainLayout = ({ user, onLogout, children, navigateTo }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    return (
        <Box>
            {isDesktop ? (
                <Box as="nav" pos="fixed" left="0" w="250px" h="100%" bg="white" shadow="md" p={4}>
                    <Heading as="h1" size="lg" color="#073B4C" mb={8} textAlign="center">GiveAway</Heading>
                    <SidebarContent navigateTo={navigateTo} onLogout={onLogout} onClose={() => {}} />
                </Box>
            ) : (
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent><DrawerCloseButton /><DrawerHeader>Menu</DrawerHeader>
                        <DrawerBody><SidebarContent navigateTo={navigateTo} onLogout={onLogout} onClose={onClose} /></DrawerBody>
                    </DrawerContent>
                </Drawer>
            )}

            <Box ml={isDesktop ? "250px" : "0"}>
                <Flex as="header" bg="white" shadow="sm" align="center" justify="space-between" h={16} px={4}>
                    {!isDesktop && (
                        <IconButton icon={<HamburgerIcon />} onClick={onOpen} variant="ghost" aria-label="Open Menu" />
                    )}
                    <Box flex="1"></Box> {/* Spacer */}
                    <Flex align="center">
                        <Text mr={4} fontWeight="semibold" display={{ base: 'none', sm: 'block' }}>Welcome, {user?.firstName || 'User'}</Text>
                        <Menu>
                            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                                <Image boxSize="40px" borderRadius="full" src={`https://placehold.co/100x100/FFD166/073B4C?text=${user?.firstName?.charAt(0) || 'U'}`} alt="User Avatar" />
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => navigateTo('profile')}>My Profile</MenuItem>
                                <MenuItem onClick={onLogout}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
                <Box as="main">{children}</Box>
            </Box>
        </Box>
    );
};

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('giveaway_token');
        const savedUser = localStorage.getItem('giveaway_user');
        if (savedToken && savedUser) {
            setAuthToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    const handleLoginSuccess = (userData, token) => {
        localStorage.setItem('giveaway_token', token);
        localStorage.setItem('giveaway_user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
        setIsAuth(true);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('giveaway_token');
        localStorage.removeItem('giveaway_user');
        setAuthToken(null);
        setUser(null);
        setIsAuth(false);
        setCurrentPage('login');
    };

    const renderPageContent = () => {
        switch (currentPage) {
            case 'profile': return <ProfilePage user={user} authToken={authToken} />;
            case 'campaigns': return <CampaignsPage user={user} authToken={authToken} />;
            case 'dashboard':
            default: return <DashboardPage />;
        }
    };
    
    if (!isAuth) {
        switch (currentPage) {
            case 'register': return <RegisterPage navigateTo={setCurrentPage} />;
            default: return <LoginPage navigateTo={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
        }
    }

    return (
        <MainLayout user={user} onLogout={handleLogout} navigateTo={setCurrentPage}>
            {renderPageContent()}
        </MainLayout>
    );
}

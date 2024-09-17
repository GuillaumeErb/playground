import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignOutButton } from "./SignOutButton";
import { SignInButton } from "./SignInButton";
import { Avatar, makeStyles, Text, Menu, MenuTrigger, MenuList, MenuItem, Button, MenuPopover } from "@fluentui/react-components";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center', // Center the title
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f3f2f1',
        borderBottom: '1px solid #e1e1e1',
        position: 'relative', // Necessary for positioning the right section
    },
    appName: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    rightSection: {
        position: 'absolute', // Keep the user controls on the far right
        right: '30px',
        display: 'flex',
        alignItems: 'center',
        '> *:not(:last-child)': {
            marginRight: '10px',
        },
    },
    menuTrigger: {
        cursor: 'pointer', // Change cursor to pointer for better UX
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        marginRight: '8px', // Space between avatar and text
    },
    menuPopover: {
        position: 'absolute',
        top: '100%', // Position it below the trigger
        left: 0, // Align with the trigger
        marginTop: '8px', // Space between the avatar and dropdown
        zIndex: 1000, // Ensure it appears above other elements
    },
});

export const TopBar = () => {
    const styles = useStyles();
    
    // Simulating user authentication state
    const { accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const user = accounts?.[0];

    // Extract initials from user's name
    const getInitials = (name: string) => {
        const names = name.split(" ");
        return names.map(n => n[0]).join("");
    };
    return (
        <div className={styles.root}>
            {/* App Name */}
            <div className={styles.appName}>
                Playground
            </div>

            {/* Authentication State */}
            <div className={styles.rightSection}>
                {isAuthenticated ? (
                    <Menu>
                        <MenuTrigger>
                            <div className={styles.menuTrigger}>
                            <Avatar 
                                    initials={getInitials(accounts[0].name!)} 
                                    name={user.name} 
                                    className={styles.avatar} 
                                />
                                <Text>{user.name}</Text>
                            </div>
                        </MenuTrigger>
                        <MenuPopover className={styles.menuPopover}>
                            <MenuList>
                                <MenuItem>
                                    <Text>{user.name}</Text>
                                </MenuItem>
                                <MenuItem>
                                    <SignOutButton/>
                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                ) : (
                    <SignInButton />
                )}
            </div>
        </div>
    );
};
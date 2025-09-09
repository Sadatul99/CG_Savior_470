import { useEffect, useState } from "react";
import useAuth from "./useAuth";

const useAdmin = () => {
    const { user } = useAuth();
    const useremail = user?.email;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);

    useEffect(() => {
        // Create abort controller for cleanup
        const controller = new AbortController();
        
        const checkAdmin = async () => {
            if (!useremail) {
                setIsAdmin(false);
                setIsAdminLoading(false);
                return;
            }
            
            setIsAdminLoading(true);
            
            try {
                const response = await fetch(`http://localhost:5000/users/email/${useremail}`, {
                    signal: controller.signal,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access-token')}`
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        // Token expired or invalid
                        console.error("Authentication failed");
                        setIsAdmin(false);
                        setIsAdminLoading(false);
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setIsAdmin(data.role === "admin");
                setIsAdminLoading(false);
            } catch (error) {
                if (error.name === 'AbortError') {
                    // Request was aborted, no need to handle as error
                    console.log('Admin check aborted');
                } else {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                    setIsAdminLoading(false);
                }
            }
        };

        checkAdmin();

        return () => {
            controller.abort();
        };
    }, [useremail]);

    return [isAdmin, isAdminLoading]
};

export default useAdmin;
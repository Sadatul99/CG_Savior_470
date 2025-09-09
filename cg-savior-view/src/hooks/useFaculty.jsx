import { useEffect, useState } from "react";
import useAuth from "./useAuth";

const useFaculty = () => {
    const { user } = useAuth();
    const useremail = user?.email;
    const [isFaculty, setIsFaculty] = useState(false);
    const [isFacultyLoading, setIsFacultyLoading] = useState(true);

    useEffect(() => {
        // Create abort controller for cleanup
        const controller = new AbortController();
        
        const checkFaculty = async () => {
            if (!useremail) {
                setIsFaculty(false);
                setIsFacultyLoading(false);
                return;
            }
            
            setIsFacultyLoading(true);
            
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
                        setIsFaculty(false);
                        setIsFacultyLoading(false);
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setIsFaculty(data.role === "faculty");
                setIsFacultyLoading(false);
            } catch (error) {
                if (error.name === 'AbortError') {
                    // Request was aborted, no need to handle as error
                    console.log('Faculty check aborted');
                } else {
                    console.error("Error checking faculty status:", error);
                    setIsFaculty(false);
                    setIsFacultyLoading(false);
                }
            }
        };

        checkFaculty();

        return () => {
            controller.abort();
        };
    }, [useremail]);

    return [isFaculty, isFacultyLoading]
};

export default useFaculty;
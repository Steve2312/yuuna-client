import {useEffect, useState} from "react";
import OutletService from "@/services/OutletService";

const useOutletService = () => {

    const [outlet, setOutlet] = useState(OutletService.getState());

    useEffect(() => {
        OutletService.attach(setOutlet);

        return () => {
            OutletService.detach(setOutlet);
        };
    }, []);

    return [outlet];

};

export default useOutletService;
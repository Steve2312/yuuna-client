import {useEffect, useState} from "react";
import PlayerService from "@/services/PlayerService";

const usePlayerService = () => {

    const [player, setPlayer] = useState(PlayerService.getState());

    useEffect(() => {
        PlayerService.attach(setPlayer);

        return () => {
            PlayerService.detach(setPlayer);
        };
    }, []);

    return [player];
};

export default usePlayerService;
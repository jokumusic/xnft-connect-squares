import React, { useState, useContext } from "react";
import { Text, View, Button, TextField, Image,
  usePublicKey, useSolanaConnection, useNavigation
} from "react-xnft";
import { donate } from "../utils/connect-squares";
import { buttonStyle } from "../styles";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { GlobalContext } from "./GlobalProvider";
import { loadingImgUri } from "../assets";

export function ScreenDonate() {
    const globalContext = useContext(GlobalContext);
    const nav = useNavigation();
    const connection = useSolanaConnection();
    const wallet = usePublicKey();
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState("Thanks for donating, it helps continue development.");
    const [showLoadingImage, setShowLoadingImage] = useState(false);
    
    async function onDonateClick() {
        const n = Number(amount);
        if(Number.isNaN(n))
        {
            setMessage("amount is not a valid number");
            return;
        }
        if(n<=0) {
            setMessage("amount must be greater than 0");
            return;
        }
        const donation = n * LAMPORTS_PER_SOL;
        
        setShowLoadingImage(true);
        const confirmation = await donate(connection, wallet, donation)
            .catch(err=>setMessage(err.toString()));

        if(confirmation) {
            setMessage("");
            globalContext.refreshWalletBalance();
            nav.pop();
        }

        setShowLoadingImage(false);
    }

    async function onCancelClick() {
        nav.pop();
    }

    return (
        <View>
            <Text style={{color:'red'}}>{message}</Text>
            { showLoadingImage &&
                <Image src={loadingImgUri} style={{ alignSelf: 'center'}}/>
            }
        
            <View>
                <Text>Amount To Donate:</Text>
                <TextField
                    value={amount.toString()}
                    onChange={(e) =>{setAmount(e.target.value)}}
                    placeholder={"enter amount to donate"}/> 

                <View style={{display:'flex', flexDirection:'row', alignContent:'center'}}>
                    <Button style={buttonStyle} onClick={()=>onDonateClick()}>Submit</Button>
                    <Button style={buttonStyle} onClick={()=>onCancelClick()}>Cancel</Button>      
                </View>
            </View>
        </View>
    );

}
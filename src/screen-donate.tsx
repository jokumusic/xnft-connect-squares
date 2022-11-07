import React, { useState } from "react";
import { Text, View, Button, TextField,
  usePublicKey, useSolanaConnection, useNavigation
} from "react-xnft";
import { donate } from "../utils/connect-squares";
import { buttonStyle } from "../styles";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function ScreenDonate() {
    const nav = useNavigation();
    const connection = useSolanaConnection();
    const wallet = usePublicKey();
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState("Thanks for donating, it helps continue development.");
    
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
        donate(connection, wallet, donation);
        nav.pop();
    }

    async function onCancelClick() {
        nav.pop();
    }

    return (
        <View>
            <Text style={{color:'red'}}>{message}</Text>
        
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
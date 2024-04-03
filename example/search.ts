import { Connection, PublicKey,clusterApiUrl } from "@solana/web3.js";

const Raydium_Public_Key: string = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

const Session_Hash: string = "ONDEMO" + Math.ceil(Math.random() * 1e9);
let credits: number = 0;

const raydium: PublicKey = new PublicKey(Raydium_Public_Key);

const connection: Connection = new Connection(clusterApiUrl("mainnet-beta"), {
    wsEndpoint: 'wss://solana-mainnet.g.alchemy.com/v2/btVxhWGLDbEKRIsh40mIkXGDbVfvwzR1',
    httpHeaders: { "x-session-hash": Session_Hash }
});

async function main(connection: Connection, programAddress: PublicKey) {
    console.log("Monitoring logs for:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            console.log(logs, err, signature ,"logss");
            
            // if (err) return;
            
            // if (logs && logs.some(log => log.includes("initalize2"))) {
            //     console.log("Signature for 'initialize2':", signature);
            //     fetchRaydiumAccounts(signature, connection);

            // }
        },
        "finalized"
    );

}

async function fetchRaydiumAccounts(txId: string, connection: Connection) {
  
    
    const tx = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });
        console.log(tx, "txxx");
        
    credits += 100;

    const instruction = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === Raydium_Public_Key);
    
    if (!instruction) {
        console.log("No instructions found in the transaction.");
        return;
    }

    // Check if instruction is fully decoded
    if ('accounts' in instruction) {
        const accounts = instruction.accounts;
        
        const tokenAIndex = 8;
        const tokenBIndex = 9;

        const tokenAAccount = accounts[tokenAIndex];
        const tokenBAccount = accounts[tokenBIndex];

        const displayData = [
            { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
            { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
        ];
        console.log("New LP Found");
        console.log(generateExplorerUrl(txId));
        console.table(displayData);
        console.log("Total QuickNode Credits Used in this session:", credits);
    } else {
        console.log("Instruction is not fully decoded.");
    }
}

function generateExplorerUrl(txId: string): string {
    return `https://solscan.io/tx/${txId}`;
}

main(connection, raydium).catch(console.error);
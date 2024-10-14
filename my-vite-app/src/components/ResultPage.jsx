function ResultPage({ link }){
    return (
        <div className = "flex flex-col h-screen p-8 bg-black items-center justify-center">
            <div className = "flex flex-col items-center mb-8">
                <svg aria-label="Vercel logomark" height="64" role="img" viewBox="0 0 74 64" style={{width: 'auto', overflow: 'visible'}}><path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="white"></path></svg>
                <h1 className = "text-4xl text-white font-bold mt-6">Vercel Clone</h1>
            </div>
            
            <div className="text-center p-8 bg-white rounded-md shadow-lg">
                <h1 className="text-4xl font-bold mb-4 text-black">Deployment Successful!</h1>
                <p className="text-lg text-black mb-6">
                    Your project has been deployed successfully. You can view it by clicking the link below.
                </p>
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-semibold text-blue-500 hover:underline"
                >
                    {link}
                </a>
            </div> 
        </div>   
    );
}

export default ResultPage;
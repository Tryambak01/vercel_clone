import { useState } from "react";

function FormPage({ onSubmit }){
    const [gitURL, setGitURL] = useState('');
    const [slug, setSlug] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(slug, gitURL);
    };

    return(
        <div className = "flex flex-col h-screen p-8 bg-black items-center justify-center">
           
            <div className = "flex flex-col items-center mb-8">
                <svg aria-label="Vercel logomark" height="64" role="img" viewBox="0 0 74 64" style={{width: 'auto', overflow: 'visible'}}><path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="white"></path></svg>
                <h1 className = "text-4xl text-white font-bold mt-6">Vercel Clone</h1>
            </div>
            
            <div className = "bg-white max-w-md p-8 rounded-md shadow-lg">
                <form onSubmit = {handleSubmit} className = "flex flex-col space-y-4">
                    <input 
                        type = "text"
                        value = { slug }
                        onChange = {(e) => setSlug(e.target.value)}
                        className = "border p-2 rounded-sm"
                        placeholder = "enter subdomain name..."
                        required
                    />
                    <input
                        type = "text"
                        value = { gitURL }
                        onChange = {(e) => setGitURL(e.target.value)}
                        className = "border p-2 rounded-sm"
                        placeholder = "enter git url..."
                        required
                    />
                    <button
                        type = "submit"
                        disabled = {!slug || !gitURL}
                        className = {`p-2 rounded ${slug && gitURL ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FormPage;
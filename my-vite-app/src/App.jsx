import { useState } from 'react'
import FormPage from './components/FormPage'
import ResultPage from './components/ResultPage'

function App() {
  const [result, setResult] = useState(false);
  const [deploymentLink, setDeploymentLink] = useState('');

  const handleFormSubmit = async (slug, gitURL) => {
    const response = await fetch('http://localhost:9000/project',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gitURL, slug }),
    });

    if(response.ok){
      const _result_ = await response.json();
      setDeploymentLink(_result_.data.url);
      setResult(true);
    }
  };

  return (
      <>
        {result ? (<ResultPage link = { deploymentLink }/>) : (<FormPage onSubmit = { handleFormSubmit }/>)}
      </>
  )
}

export default App

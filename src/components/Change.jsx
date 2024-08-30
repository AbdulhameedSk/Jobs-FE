function Change() {
    const { globalValue, setGlobalValue } = useGlobal();
  
    return (
      <div>
        console.log("Menu Altered");
        
        <button onClick={() => setGlobalValue(!globalValue)}>|||</button>
      </div>
    );
  }
export default Change;  
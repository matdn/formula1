import FormulaView from "../views/three/formulaView";
import TextView from "../views/three/textView";
import "./Header.css";
const Header = () => {
    return (
        <>
            <header className="header">
                <nav className="header-nav">
                </nav>
                <FormulaView></FormulaView>
            </header>
            <div className="history">
                <TextView></TextView>
            </div>
            <div className="split">
            </div>
        </>
    );
};

export default Header;

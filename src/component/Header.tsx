export const Header = (props : {goto: (pathname: string) => void}) => <div className="header">
    <div className="left-side">
        <img className="msg-icon" src="/icon-ministere.png" style={{ transform: "translateX(-20px)", cursor: "pointer"}} onClick={e => {
            e.preventDefault();
            props.goto(`/`)
        }}/>
        <img className="msg-icon" style={{ marginLeft: "35px", transform: "scale(0.8)", cursor: "pointer"}}  src="/icon-msg-txt-beta.png"  onClick={e => {
            e.preventDefault();
            props.goto(`/`)
        }}/>
    </div>
</div>
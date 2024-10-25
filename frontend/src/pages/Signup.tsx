import {Quote} from "../components/Quote.tsx";
import {Auth} from "../components/Auth.tsx";

export const Signup = ()=>{
    return <div>
        <div className="grid grid-cols-2">
            <div>
                <Auth type="signup"/>
            </div>
            <div className="invisible lg:visible">
                <Quote />
            </div>

        </div>
    </div>
}
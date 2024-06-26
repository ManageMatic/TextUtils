import React, { useState } from 'react'

export default function About(props) {

    {/*const [myStyle, setMyStyle] = useState(
        {
            color: 'black',
            backgroundColor: 'white'
        }
    )

    const [btntext, setBtnText] = useState("Enable Dark Mode")

    const toggleStyle = () => {
        if (myStyle.color === 'black') {
            setMyStyle({
                color: 'white',
                backgroundColor: 'black',
                border: '1px solid white'
            });
            setBtnText("Enable Light Mode")
        }
        else {
            setMyStyle({
                color: 'black',
                backgroundColor: 'white'
            });
            setBtnText("Enable Dark Mode")
        }
    };*/}

    return (
        <div className="container my-2" style={{ backgroundColor: props.mode === 'dark' ? '#1c2c45' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }}>
            <h2 className="my-2">About Us</h2>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }} data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <strong>TextUtils: Enhancing Writing Efficiency</strong>
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }}>
                            TextUtils is an innovative and user-friendly application designed to assist users in
                            efficiently analyzing their text. Whether you are a student, writer, or professional,
                            TextUtils provides a seamless way to evaluate your writing. The application offers a
                            range of features including word and character counting, case conversion, and the
                            ability to remove extra spaces. These tools are essential for anyone looking to
                            optimize their text for clarity and precision. TextUtils stands out with its
                            straightforward interface, making it accessible even for those with minimal technical expertise.
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }}>
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <strong>Versatility and User-Friendliness</strong>
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }}>
                            One of the key strengths of TextUtils is its versatility. Users can quickly convert text
                            between uppercase and lowercase, capitalize the first letter of sentences, and even copy
                            text to the clipboard with just a few clicks. The built-in speech synthesis function allows
                            users to listen to their text, aiding in the identification of errors and improving the
                            overall flow of the content. This feature is particularly beneficial for content creators
                            and editors who need to ensure their text sounds as good as it looks. Additionally,
                            TextUtils’ compatibility with various browsers enhances its utility, ensuring that it
                            can be used across different platforms and devices.
                        </div>
                    </div>
                </div>{/*hoooooooo */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            <strong>Promoting Productivity with Real-Time Feedback</strong>
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body" style={{ backgroundColor: props.mode === 'dark' ? 'rgb(36 74 104)' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }}>
                            Furthermore, TextUtils promotes productivity by providing instant feedback on text statistics.
                            The real-time display of word count, character count, and estimated reading time helps users
                            manage their writing tasks more effectively. This functionality is especially useful for meeting
                            specific writing guidelines and limits, such as those found in academic papers, social media
                            posts, and professional documents. By offering these comprehensive text analysis tools,
                            TextUtils empowers users to produce high-quality, polished content effortlessly.
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="container my-3">
                <button className="btn btn-primary" type='button' onClick={toggleStyle}>{btntext}</button>
            </div>*/}
        </div>
    )
}
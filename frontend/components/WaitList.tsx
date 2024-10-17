
export function WaitList(){

    return(
        <section className="bg-white">
            <div className="flex flex-col space-y-4 items-center rounded-3xl w-5/6 md:w-3/5 mx-auto bg-[#0B0C16] md:h-52 p-8 mt-16 mb-20">
                <h1 className="text-2xl md:text-3xl text-center text-white">Insurance powered for the future</h1>

                <p className="text-center text-sm text-gray-100 w-full md:w-1/2">Be one of the first to experience unparalled digital assets protection and staking rewards. Join the waitlist now</p>

                <form action='' className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <input type="text" className="rounded-md bg-transparent border border-1 border-[#575875] md:w-80 px-2 py-2 md:py-0 text-white"/>
                    <button type='submit' className="bg-white w-3/5 mx-auto text-[#1E1E33] rounded-md text-sm p-2 hover:bg-blue-500">Join waitlist</button>
                </form>
            </div>
        </section>
    )
}
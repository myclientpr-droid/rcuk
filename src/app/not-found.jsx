

export default function NotFound({message = 'The you are looking for is not available, make sure your has no typo', title='404 Not Found'}) {
  
  return (
    <div className='w-full h-screen mt-10 max-w-3xl text-center mx-auto my-auto px-6px py-8px'>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
    )
}

import appPhoto from '@/assets/connectify.svg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-center flex-col'>
      <h1 className='text-4xl font-bold text-black'>Welcome to Connectify</h1>
      <div className='flex items-center justify-center py-2'>
        <img src={appPhoto} className='max-w-[600px]'/>
      </div>
      <h2 className='text-3xl text-black'>Start adding your contacts</h2>
      <div className='py-3'>
        <Button onClick={() => navigate('/contacts')}>Add Contacts Now</Button>
      </div>
    </div>
  )
}

export default Home
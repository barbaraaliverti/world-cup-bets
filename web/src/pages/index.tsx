
// use Next's Image component for image optimization
import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logo from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  poolCount: number,
  guessCount: number,
  userCount: number
}

export default function Home(props: HomeProps) {
  const [ poolTitle, setPoolTitle ] = useState('');

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert('Betting pool created! Your pool code was copied to clipboard.');

      setPoolTitle('');
    } catch (err) {
      console.log(err);
      alert('Failed to create betting pool, please try again.')
    }

    
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logo} alt="World Cup Bets" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Create and share your own World Cup betting pools!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-greenIgnite-500">+{props.userCount}</span> users having fun
          </strong>
        </div>

        <form onSubmit={createPool}  className="mt-10 flex gap-2" action="">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text" 
            required 
            placeholder="Enter a title for your pool"
            onChange={ event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button className="bg-yellowIgnite-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellowIgnite-700" type="submit">Create my pool</button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          After you create your betting pool, you will receive a unique code to share and invite people to bet on your pool 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex justify-between">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl">+{props.poolCount}</span>
              <span>pools created</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"/>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl">+{props.guessCount}</span>
              <span>bets made</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="Two cellphones showing a preview of the World Cup Bets app" />
    </div>
  )
}

export const getServerSideProps = async () => {
  // const response = await fetch('http://localhost:3333/pools/count')
  // const data = await response.json()

  // this way, se second promise needs to wait for the first one to finish
  // const poolCountResponse = await api.get('pools/count');
  // const guessCountResponse = await api.get('guesses/count');

  // run parallel promises
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  console.log(poolCountResponse.data)

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}

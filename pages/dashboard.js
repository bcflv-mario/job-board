import { getSession, useSession } from 'next-auth/react'
import prisma from 'lib/prisma'
import { getJobsPosted, getUser, getApplications  } from 'lib/data.js'
import Jobs from 'components/Jobs'
import Link from 'next/link'

export default function Dashboard({ jobs, user, applications }) {
  const { data: session, status } = useSession()
  return (
    <div className='mt-10'>
      <div className='text-center p-4 m-4'>
        <h2 className='mb-10 text-4xl font-bold'>Dashboard</h2>
        {user.company && (
          <span className='bg-black text-white uppercase text-sm p-2 '>
            Company
          </span>
        )}
        {session && (
          <p className='mt-10 mb-10 text-2xl font-normal'>
          {user.company ? 'all the jobs you posted' : 'your applications'}
        </p>
        )}
      </div>

      {user.company ? (
        <Jobs jobs={jobs} isDashboard={true} />
      ) : (
        <>
			    {applications.map((application, application_index) => {
			      return (
			        <div key={application_index} className='mb-4 mt-20 flex justify-center'>
                <div className='pl-16 pr-16 -mt-6 w-1/2'>
                  <Link href={`/job/${application.job.id}`}>
                    <a className='text-xl font-bold underline'>
                      {application.job.title}
                    </a>
                  </Link>
                  <h2 className='text-base font-normal mt-3'>
                    {application.coverletter}
                  </h2>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  // console.log('dashboard session', session)

  let user = await getUser(session.user.id, prisma)
  user = JSON.parse(JSON.stringify(user))
  
  let jobs = []
  let applications = []

	// user = JSON.parse(JSON.stringify(user))

  if (user.company) {
    jobs = await getJobsPosted(user.id, prisma)
    jobs = JSON.parse(JSON.stringify(jobs))
  } else {
    applications = await getApplications(user.id, prisma)
    applications = JSON.parse(JSON.stringify(applications))
  }


  return {
    props: {
      jobs,
      user,
      applications,
    },
  }
}
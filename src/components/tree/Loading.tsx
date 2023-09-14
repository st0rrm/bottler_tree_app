const Loading = () => {
  return (
    <div className={'absolute top-0 left-0 w-full h-full z-40 flex items-center justify-center'}>
      <div className={'flex flex-col items-center'}>
        <div className={'text-sm text-gray-500 py-4'}>나무 심는 중</div>
        <div className={'spinner'}></div>
      </div>
    </div>
  )
}

export default Loading

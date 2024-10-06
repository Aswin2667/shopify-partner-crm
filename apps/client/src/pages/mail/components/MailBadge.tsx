const MailBadge = ({ text = "Badge Name", onClick, color = "blue" }: any) => {
  return (
    <span
      id="badge-dismiss-default"
      className={`inline-flexclear items-center px-2 py-1 me-2 text-sm font-medium text-${color}-800 bg-${color}-100 rounded dark:bg-${color}-900 dark:text-${color}-300`}
    >
      {text}
      <button
        type="button"
        className={`inline-flex items-center p-1 ms-2 text-sm text-${color}-400 bg-transparent rounded-sm hover:bg-${color}-200 hover:text-${color}-900 dark:hover:bg-${color}-800 dark:hover:text-${color}-300`}
        data-dismiss-target="#badge-dismiss-default"
        aria-label="Remove"
        onClick={onClick}
      >
        <svg
          className="w-2 h-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Remove badge</span>
      </button>
    </span>
  );
};

export default MailBadge;

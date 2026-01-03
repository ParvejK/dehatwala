# Docs

# How to use modal

```jsx
import ServicesModal from "./modals";
import { useRef } from "react";

const ServicesCard = () => {
  const modalRef = useRef < HTMLDialogElement > null;

  const handleActiveModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <div className="max-w-sm" onClick={handleActiveModal}>
      <ServicesModal ref={modalRef} title="Hello!">
        <p>Press ESC key or click on ✕ button to close</p>
      </ServicesModal>
    </div>
  );
};

export default ServicesCard;
```

## React query

- caching data

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      gcTime: 300_000, // 5min
      staleTime: 10 * 1000, // 10 second
    },
  },
});
```

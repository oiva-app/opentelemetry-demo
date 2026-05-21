// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Ad from '../../../components/Ad';
import Layout from '../../../components/Layout';
import ProductPrice from '../../../components/ProductPrice';
import Recommendations from '../../../components/Recommendations';
import ProductReviews from '../../../components/ProductReviews';
import Select from '../../../components/Select';
import { CypressFields } from '../../../utils/enums/CypressFields';
import ApiGateway from '../../../gateways/Api.gateway';
import { Product } from '../../../protos/demo';
import AdProvider from '../../../providers/Ad.provider';
import { useCart } from '../../../providers/Cart.provider';
import * as S from '../../../styles/ProductDetail.styled';
import { useCurrency } from '../../../providers/Currency.provider';
import ProductReviewProvider from '../../../providers/ProductReview.provider';
import ProductAIAssistantProvider from '../../../providers/ProductAIAssistant.provider';

const qtyOptions = new Array(10).fill(0).map((_, i) => i + 1);

const ProdDetail: NextPage = () => {
  const { push, query } = useRouter();
  const [quantity, setQuantity] = useState(1);
  const {
    addItem,
    cart: { items },
  } = useCart();
  const { selectedCurrency } = useCurrency();
  const prodId = query.productId as string;

  useEffect(() => {
    setQuantity(1);
  }, [prodId]);

  const {
    data: {
      name,
      picture,
      description,
      priceUsd = { units: 0, currencyCode: 'USD', nanos: 0 },
      categories,
    } = {} as Product,
  } = useQuery({
      queryKey: ['product', prodId, 'selectedCurrency', selectedCurrency],
      queryFn: () => ApiGateway.getProduct(prodId, selectedCurrency),
      enabled: !!prodId,
    }
  ) as { data: Product };

  const onAddItem = useCallback(async () => {
    await addItem({
      productId: prodId,
      quantity,
    });
    push('/cart');
  }, [addItem, prodId, quantity, push]);

  return (
    <AdProvider
      productIds={[prodId, ...items.map(({ productId }) => productId)]}
      contextKeys={[...new Set(categories)]}
    >
      <Head>
        <title>Otel Demo - Product</title>
      </Head>
      <Layout>
        <S.ProductDetail data-cy={CypressFields.ProductDetail}>
          <S.Container>
            {picture ? (
              <S.Image
                $src={`/assets/products/${picture}`}
                data-cy={CypressFields.ProductPicture}
              />
            ) : null}
            <S.Details $fullWidth={!picture}>
              <S.Name data-cy={CypressFields.ProductName}>{name}</S.Name>
              <S.Description data-cy={CypressFields.ProductDescription}>{description}</S.Description>
              <S.ProductPrice>
                <ProductPrice price={priceUsd} />
              </S.ProductPrice>
              <S.Text>Quantity</S.Text>
              <Select
                data-cy={CypressFields.ProductQuantity}
                onChange={event => setQuantity(+event.target.value)}
                value={quantity}
              >
                {qtyOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <S.AddToCart data-cy={CypressFields.ProductAddToCart} onClick={onAddItem}>
                <Image src="/icons/Cart.svg" height="15" width="15" alt="cart" /> Add To Cart
              </S.AddToCart>
            </S.Details>
          </S.Container>
          {prodId && (
              <ProductAIAssistantProvider productId={prodId}>
                <ProductReviewProvider productId={prodId}>
                  <ProductReviews />
                </ProductReviewProvider>
              </ProductAIAssistantProvider>
          )}
          <Recommendations />
        </S.ProductDetail>
        <Ad />
      </Layout>
    </AdProvider>
  );
};

export default ProdDetail;

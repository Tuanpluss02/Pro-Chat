#include <bits/stdc++.h>
#define For(i,a,b) for(int i=a; i<=b; ++i)

using namespace std;

int t, m, n, dp[105][105], a[105][105];
int main() {
  cin >> t;
  while(t--){
    cin >> m >> n;
    For(i,1,m) For(j,1,n) cin >> a[i][j];
    For(i,1,n) dp[0][i]=-INT_MAX, dp[m+1][i]=-INT_MAX;
    For(i,1,m) dp[i][1]=a[i][1];
    For(j,2,n){
      For(i,1,m){
        dp[i][j]=max(max(dp[i-1][j-1],dp[i][j-1]),dp[i+1][j-1])+a[i][j];
      }
    }
    int ans=-INT_MAX;
    For(i,1,m) ans=max(ans,dp[i][n]);
    cout<<ans<<'\n';
  }
return 0;
}

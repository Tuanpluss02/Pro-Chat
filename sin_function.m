x=[0:0.5:4*pi];
y=sin(x);
z=cos(x);

subplot(3,1,1);
plot(x,y,'r--+');

subplot(3,1,2);
plot(x,z,'m','linewidth',2);

subplot(3,1,3);
plot(x,y,x,z);